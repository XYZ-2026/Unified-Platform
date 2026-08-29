import { NextRequest, NextResponse } from "next/server";

interface ExtracurricularActivity {
  id: string;
  title: string;
  organization: string;
  category: string;
  hoursPerWeek: string;
  duration?: string;
  description: string;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// OpenRouter candidate models from the abroad folder
const OPENROUTER_MODELS = [
  "openrouter/free",
  "openrouter/auto",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct",
  "google/gemma-4-31b-it:free",
  "deepseek/deepseek-chat",
  "qwen/qwen-2.5-72b-instruct"
];

// Gemini models pool — Gemini 2.5 is primary
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

function buildAnalysisPrompt(
  activities: ExtracurricularActivity[],
  targetMajor?: string,
  dreamSchool?: string
) {
  const formattedActivities = activities.map((act, index) => {
    return `Activity #${index + 1}:
- Position/Role: ${act.title}
- Organization: ${act.organization}
- Category: ${act.category || 'Unspecified'}
- Time Commitment: ${act.hoursPerWeek} ${act.duration ? `• ${act.duration}` : ''}
- Description: ${act.description}
- ID: ${act.id}`;
  }).join('\n\n');

  return `You are a Former Dean of Undergraduate Admissions at an Ivy League / Top-15 US University (e.g. Stanford, MIT, Harvard, UPenn).
Evaluate this applicant's extracurricular activity list holistically, exactly the way a top admissions committee evaluates Common App / Coalition activity slots.

APPLICANT PROFILE CONTEXT:
- Intended Major: ${targetMajor || 'Computer Science / Undeclared'}
- Dream University: ${dreamSchool || 'Top 20 Universities'}
- Total Activities: ${activities.length} of 10

ACTIVITIES LIST:
${formattedActivities}

EVALUATION CRITERIA:
1. Overall Holistic Score (0-100) & Common App Tier (Tier 1: National/International impact; Tier 2: State/Regional leadership; Tier 3: School/Local engagement; Tier 4: Casual participation).
2. Spike Assessment: Is there a focused intellectual spike or cohesive narrative vs unfocused checklist?
3. Component Scores (0-100 each): Leadership, Impact & Reach, Commitment & Depth, Uniqueness.
4. Strategic Strengths (3 concise bullet points).
5. Vulnerabilities / Gaps (2-3 concise points identifying missing depth, awards, or hours density).
6. Activity-by-activity feedback with high-impact power rewrites (using strong action verbs and quantified impact metrics).
7. Final Admissions Committee Verdict.

Respond ONLY with valid JSON in the exact structure below. Do not wrap in markdown or conversational text:
{
  "overallScore": 88,
  "tier": "Tier 1 - Highly Competitive for Top 20",
  "tierRank": 1,
  "spikeRating": "Strong STEM & Social Impact Spike",
  "summary": "Executive summary of the student's extracurricular profile and how an admissions committee views it.",
  "breakdown": {
    "leadershipScore": 90,
    "impactScore": 85,
    "commitmentScore": 92,
    "uniquenessScore": 84
  },
  "strengths": [
    "Demonstrated founder-level agency and initiative",
    "Clear alignment between technical execution and societal problem-solving",
    "Quantified outcome metrics validate legitimacy"
  ],
  "gaps": [
    "Needs more formal third-party awards or regional press validation",
    "Descriptions could feature sharper active verbs and revenue/user figures"
  ],
  "activityFeedback": [
    {
      "activityId": "${activities[0]?.id || 'act-1'}",
      "title": "${activities[0]?.title || 'Activity Title'}",
      "rating": "Strong",
      "critique": "Brief 1-sentence assessment of this entry.",
      "suggestedRewrite": "High-impact rewrite under 150 chars maximizing admissions impact.",
      "actionableAdvice": "Concrete recommendation to elevate this specific activity."
    }
  ],
  "admissionsVerdict": "Holistic decision verdict summary."
}`;
}

async function callGroq(prompt: string): Promise<{ data: any; model: string }> {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");

  const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
  let lastErr = null;

  for (const model of groqModels) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You are an elite university admissions committee director. Return valid raw JSON ONLY."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return { data: parsed, model: `Groq (${model})` };
        }
      } else {
        const errText = await res.text();
        console.warn(`Groq model ${model} failed with status ${res.status}:`, errText);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All Groq models failed");
}

async function callGemini(prompt: string): Promise<{ data: any; model: string }> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  let lastErr = null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (res.ok) {
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (rawText) {
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return { data: parsed, model: `Gemini (${model})` };
        }
      } else {
        const errText = await res.text();
        console.warn(`Gemini model ${model} failed:`, res.status, errText);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All Gemini models failed");
}

async function callOpenRouter(prompt: string): Promise<{ data: any; model: string }> {
  if (!OPENROUTER_API_KEY) throw new Error("OpenRouter API key not configured");

  let lastErr = null;
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://abroadsimplified.com",
          "X-Title": "Abroad Simplified Activity Evaluator"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You are an elite university admissions committee director. Return valid raw JSON ONLY."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (res.ok) {
        const json = await res.json();
        const rawContent = json?.choices?.[0]?.message?.content?.trim();
        if (rawContent) {
          const match = rawContent.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            return { data: parsed, model: `OpenRouter (${model})` };
          }
        }
      } else {
        const errText = await res.text();
        console.warn(`OpenRouter model ${model} failed:`, res.status, errText);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All OpenRouter models failed");
}

function localHeuristicAnalysis(
  activities: ExtracurricularActivity[],
  targetMajor?: string,
  dreamSchool?: string
) {
  const count = activities.length;
  let baseScore = 70;
  
  if (count >= 5) baseScore += 12;
  else if (count >= 3) baseScore += 8;
  else baseScore += count * 2;

  const hasLeadership = activities.some(a => 
    /founder|lead|president|captain|chair|director|head|creator/i.test(a.title || '') ||
    /leadership/i.test(a.category || '')
  );
  if (hasLeadership) baseScore += 8;

  const hasSTEMOrResearch = activities.some(a =>
    /research|code|developer|robotics|math|science|ai|data/i.test((a.title || '') + ' ' + (a.description || ''))
  );
  if (hasSTEMOrResearch) baseScore += 5;

  const overallScore = Math.min(96, Math.max(65, baseScore));
  const tier = overallScore >= 90 ? "Tier 1 - Highly Competitive" : overallScore >= 80 ? "Tier 2 - Strong Regional / State Impact" : "Tier 3 - Solid School & Local Engagement";
  const tierRank = overallScore >= 90 ? 1 : overallScore >= 80 ? 2 : 3;

  return {
    overallScore,
    tier,
    tierRank,
    spikeRating: hasLeadership && hasSTEMOrResearch ? "Distinct Leadership & Technical Spike" : "Well-Rounded Profile with Developing Focus",
    summary: `The applicant presents ${count} activities demonstrating consistent commitment. The strongest asset is ${activities[0]?.title || 'the primary leadership role'}, which provides a clear focal anchor for admissions evaluation.`,
    breakdown: {
      leadershipScore: hasLeadership ? 91 : 78,
      impactScore: Math.min(95, overallScore - 2),
      commitmentScore: Math.min(96, overallScore + 3),
      uniquenessScore: Math.min(92, overallScore - 4)
    },
    strengths: [
      hasLeadership ? "Demonstrated agency and initiative through leadership positioning" : "Broad participation across extracurricular domains",
      "Sustained weekly time allocation showing dedication",
      activities[0]?.organization ? `Legitimate community engagement via ${activities[0].organization}` : "Focused activity selection"
    ],
    gaps: [
      "Quantified impact metrics could be more explicit in role descriptions",
      "Consider securing external competition awards or regional honors to solidify Tier 1 standing"
    ],
    activityFeedback: activities.map(act => ({
      activityId: act.id,
      title: act.title,
      rating: /founder|lead|president|captain/i.test(act.title) ? "Exceptional" : "Strong",
      critique: `Demonstrates active involvement in ${act.organization || 'the initiative'}.`,
      suggestedRewrite: `Spearheaded ${act.title.toLowerCase()} initiatives at ${act.organization || 'program'}; scaled impact across target beneficiaries with measurable outcomes.`,
      actionableAdvice: "Quantify the exact number of people impacted or revenue/hours generated."
    })),
    admissionsVerdict: `Competitive applicant profile for ${dreamSchool || 'Top-tier programs'}. Emphasizing tangible outcomes in application essays will maximize admissions probability.`
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activities, targetMajor, dreamSchool } = body;

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: "No extracurricular activities provided for analysis" },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(activities, targetMajor, dreamSchool);

    // 1. FIRST ATTEMPT: Gemini 2.5 (Primary)
    try {
      console.log("[AI Evaluator] 1. Attempting Gemini 2.5 analysis (primary)...");
      const result = await callGemini(prompt);
      return NextResponse.json({
        success: true,
        data: result.data,
        provider: result.model
      });
    } catch (geminiErr: any) {
      console.warn("[AI Evaluator] Gemini failed, falling back to Groq:", geminiErr?.message || geminiErr);
    }

    // 2. SECOND ATTEMPT: Groq fallback
    try {
      console.log("[AI Evaluator] 2. Attempting Groq analysis fallback...");
      const result = await callGroq(prompt);
      return NextResponse.json({
        success: true,
        data: result.data,
        provider: result.model
      });
    } catch (groqErr: any) {
      console.warn("[AI Evaluator] Groq failed, falling back to OpenRouter:", groqErr?.message || groqErr);
    }

    // 3. THIRD ATTEMPT: OpenRouter fallback
    try {
      console.log("[AI Evaluator] 3. Attempting OpenRouter analysis fallback...");
      const result = await callOpenRouter(prompt);
      return NextResponse.json({
        success: true,
        data: result.data,
        provider: result.model
      });
    } catch (openRouterErr: any) {
      console.warn("[AI Evaluator] OpenRouter failed, falling back to local heuristic:", openRouterErr?.message || openRouterErr);
    }

    // 4. FOURTH ATTEMPT: Local Heuristic Analysis Fallback
    const heuristicData = localHeuristicAnalysis(activities, targetMajor, dreamSchool);
    return NextResponse.json({
      success: true,
      data: heuristicData,
      provider: "Abroad Simplified Heuristic Engine"
    });

  } catch (error: any) {
    console.error("Error in extracurriculars analysis route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze extracurricular activities" },
      { status: 500 }
    );
  }
}
