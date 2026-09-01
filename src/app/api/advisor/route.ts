import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════════════════
   Application AI Advisor — Conversational College Counseling Chat
   ─ Gemini 2.5 Primary → OpenRouter Nemotron Fallback ─
   ═══════════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AdvisorRequest {
  message: string;
  history: ChatMessage[];
  profile?: {
    fullName?: string;
    gpa?: string;
    gpaWeighted?: string;
    satScore?: string;
    actScore?: string;
    classRank?: string;
    highSchool?: string;
    targetMajor?: string;
    dreamSchool?: string;
    country?: string;
    applicationCycle?: string;
    extracurriculars?: any[];
  };
  collegeList?: {
    dream?: Array<{ name: string; acceptanceRate?: string }>;
    reach?: Array<{ name: string; acceptanceRate?: string }>;
    target?: Array<{ name: string; acceptanceRate?: string }>;
    safety?: Array<{ name: string; acceptanceRate?: string }>;
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const OPENROUTER_MODELS = [
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "nvidia/nemotron-4-340b-instruct",
  "nvidia/nemotron-mini-4b-instruct",
];

/* ─── System Prompt ─────────────────────────────────────────────────── */
function buildSystemPrompt(req: AdvisorRequest): string {
  const p = req.profile;
  const cl = req.collegeList;

  let profileContext = "";
  if (p) {
    const ecs = Array.isArray(p.extracurriculars) ? p.extracurriculars : [];
    profileContext = `
STUDENT PROFILE:
- Name: ${p.fullName || "Student"}
- GPA (UW): ${p.gpa || "Not provided"} | GPA (W): ${p.gpaWeighted || "Not provided"}
- SAT: ${p.satScore || "Not provided"} | ACT: ${p.actScore || "Not provided"}
- Class Rank: ${p.classRank || "Not provided"}
- High School: ${p.highSchool || "Not provided"}
- Intended Major: ${p.targetMajor || "Undeclared"}
- Dream School: ${p.dreamSchool || "Not specified"}
- Country: ${p.country || "Not provided"}
- Application Cycle: ${p.applicationCycle || "Fall 2026"}
- Extracurricular Activities: ${ecs.length} activities${ecs.length > 0 ? " — " + ecs.slice(0, 5).map((e: any) => `${e.title || e.name || "Activity"} (${e.role || e.organization || ""})`).join(", ") : ""}
`;
  }

  let listContext = "";
  if (cl) {
    const fmt = (schools: Array<{ name: string; acceptanceRate?: string }> | undefined, tier: string) => {
      if (!schools || schools.length === 0) return "";
      return `  ${tier}: ${schools.map(s => `${s.name}${s.acceptanceRate ? ` (${s.acceptanceRate})` : ""}`).join(", ")}\n`;
    };
    const dreamStr = fmt(cl.dream, "Dream");
    const reachStr = fmt(cl.reach, "Reach");
    const targetStr = fmt(cl.target, "Target");
    const safetyStr = fmt(cl.safety, "Safety");
    if (dreamStr || reachStr || targetStr || safetyStr) {
      listContext = `\nCURRENT COLLEGE LIST:\n${dreamStr}${reachStr}${targetStr}${safetyStr}`;
    }
  }

  return `You are the **Application AI Advisor** — an elite, world-class private college counselor and admissions strategist for Abroad Simplified, a premium platform for students applying to top universities worldwide.

Your role is to be a warm, knowledgeable, and insightful conversational advisor. You help students with:
- Building and balancing college lists across Dream, Reach, Target, and Safety tiers
- Evaluating their candidacy for specific universities
- Strategizing application timelines, Early Decision/Action choices
- Essay and SOP topic brainstorming and narrative arc development
- Extracurricular positioning and Common App activity optimization
- Test score strategy (submit vs test-optional)
- Financial aid and scholarship advice
- Country-specific admissions nuances (US, UK, Canada, Germany, etc.)
- Major selection and career path alignment

GUIDELINES:
- Be conversational, concise, and actionable — avoid walls of text
- Use bullet points and short paragraphs for readability
- Reference the student's actual profile data when available
- Provide specific, data-informed recommendations (mention acceptance rates, rankings, deadlines)
- When suggesting schools, explain WHY they fit the student's profile
- Be encouraging but honest — don't sugarcoat unrealistic choices
- If you don't have enough information, ask clarifying questions
- Keep responses under 300 words unless the student asks for detailed analysis
- Do NOT use markdown headers (##) — just use bold (**text**) for emphasis
${profileContext}${listContext}`;
}

/* ─── Gemini 2.5 API Call (Primary) ─────────────────────────────────── */
async function callGemini(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  // Build conversation parts for Gemini
  const contents: any[] = [];

  // System instruction via first user+model turn
  contents.push({ role: "user", parts: [{ text: systemPrompt }] });
  contents.push({
    role: "model",
    parts: [{ text: "Understood! I'm your Application AI Advisor. I have your profile loaded and I'm ready to help with your college applications. What would you like to discuss?" }],
  });

  // Add conversation history
  for (const msg of history) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  // Add current message
  contents.push({ role: "user", parts: [{ text: userMessage }] });

  let lastErr: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.9,
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          console.log(`[Advisor] Gemini ${model} responded successfully`);
          return text;
        }
      } else {
        const errText = await res.text();
        console.warn(`[Advisor] Gemini ${model} error:`, res.status, errText.slice(0, 200));
      }
    } catch (e) {
      lastErr = e;
      console.warn(`[Advisor] Gemini ${model} exception:`, (e as Error).message);
    }
  }

  throw lastErr || new Error("All Gemini models failed");
}

/* ─── OpenRouter Fallback ───────────────────────────────────────────── */
async function callOpenRouter(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error("OpenRouter API key not configured");

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }
  messages.push({ role: "user", content: userMessage });

  let lastErr: any = null;
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://abroadsimplified.com",
          "X-Title": "Abroad Simplified Application AI Advisor",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.9,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json?.choices?.[0]?.message?.content?.trim();
        if (text) {
          console.log(`[Advisor] OpenRouter ${model} responded successfully`);
          return text;
        }
      } else {
        const errText = await res.text();
        console.warn(`[Advisor] OpenRouter ${model} error:`, res.status, errText.slice(0, 200));
      }
    } catch (e) {
      lastErr = e;
      console.warn(`[Advisor] OpenRouter ${model} exception:`, (e as Error).message);
    }
  }

  throw lastErr || new Error("All OpenRouter models failed");
}

/* ─── POST Handler ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body: AdvisorRequest = await req.json();
    const { message, history = [], profile, collegeList } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(body);

    // 1. PRIMARY: Gemini 2.5 Flash
    try {
      console.log("[Advisor] 1. Executing Gemini primary...");
      const response = await callGemini(systemPrompt, history, message);
      return NextResponse.json({
        success: true,
        response,
        provider: "Application AI Advisor",
      });
    } catch (geminiErr: any) {
      console.warn(
        "[Advisor] Gemini failed, falling back to OpenRouter:",
        geminiErr?.message || geminiErr
      );
    }

    // 2. FALLBACK: OpenRouter Nemotron
    try {
      console.log("[Advisor] 2. Executing OpenRouter fallback...");
      const response = await callOpenRouter(systemPrompt, history, message);
      return NextResponse.json({
        success: true,
        response,
        provider: "Application AI Advisor",
      });
    } catch (openRouterErr: any) {
      console.warn(
        "[Advisor] OpenRouter failed:",
        openRouterErr?.message || openRouterErr
      );
    }

    // 3. FALLBACK: Static helpful response
    return NextResponse.json({
      success: true,
      response:
        "I'm currently experiencing high demand and can't process your request right now. Here are some things I can help you with once I'm back:\n\n• **College list balancing** — I can analyze your profile and suggest Dream, Reach, Target, and Safety schools\n• **Admissions strategy** — Early Decision vs Regular Decision timing\n• **Essay brainstorming** — Topic ideas tailored to your experiences\n• **Profile evaluation** — How your GPA, scores, and activities compare\n\nPlease try again in a moment!",
      provider: "Application AI Advisor (Offline)",
    });
  } catch (error: any) {
    console.error("[Advisor] Fatal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process advisor request" },
      { status: 500 }
    );
  }
}
