import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════════════════
   AI Chance-Me Admissions Predictor — Detailed Visual Report Engine
   ─ Gemini 2.5 Primary (gemini-2.5-flash) → OpenRouter → Local Heuristic ─
   ═══════════════════════════════════════════════════════════════════════ */

interface StudentProfile {
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
  extracurriculars?: any;
  applicationCycle?: string;
}

interface ChanceMeRequest {
  targetSchool: string;
  spiceLevel: 'gentle' | 'candid' | 'roast';
  profile: StudentProfile;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const OPENROUTER_MODELS = [
  "google/gemini-2.5-flash-preview",
  "google/gemini-2.0-flash-001",
  "openrouter/auto",
  "meta-llama/llama-3.3-70b-instruct:free",
];

/* ─── Spice Personas ─────────────────────────────────────────────────── */
const SPICE_PERSONAS: Record<string, string> = {
  gentle: `You are an encouraging, world-class private college counselor. Highlight authentic strengths, frame gaps constructively with empowering solutions, and inspire confidence while remaining accurate.`,
  candid: `You are an elite, former Top-10 Dean of Admissions. Be clear, objective, and analytically rigorous. Provide realistic benchmarking without sugarcoating, pointing out exact competitive cutoffs.`,
  roast: `You are a hilariously blunt senior admissions officer reviewing your 5,000th application today. Deliver witty, sharp, tough-love feedback with bite, but keep every critique grounded in actual admissions reality.`
};

/* ─── Prompt Builder ────────────────────────────────────────────────── */
function buildChanceMePrompt(req: ChanceMeRequest): string {
  const { targetSchool, spiceLevel, profile } = req;

  let ecSummary = "None provided";
  let ecCount = 0;
  if (profile.extracurriculars) {
    const ecs = Array.isArray(profile.extracurriculars) ? profile.extracurriculars : [];
    ecCount = ecs.length;
    if (ecs.length > 0) {
      ecSummary = ecs.map((ec: any, i: number) =>
        `#${i + 1}: ${ec.title || ec.name || 'Activity'} (${ec.organization || 'Org'}) - Role: ${ec.role || 'Member'} | ${ec.hoursPerWeek || 'N/A'} hrs/wk | Desc: ${ec.description || 'N/A'}`
      ).join('\n');
    }
  }

  return `${SPICE_PERSONAS[spiceLevel] || SPICE_PERSONAS.candid}

TARGET UNIVERSITY: ${targetSchool}
INTENDED MAJOR: ${profile.targetMajor || 'Undeclared'}

STUDENT CANDIDACY DOSSIER:
- Name: ${profile.fullName || 'Applicant'}
- GPA (Unweighted): ${profile.gpa || 'Not provided'}
- GPA (Weighted): ${profile.gpaWeighted || 'Not provided'}
- SAT Composite: ${profile.satScore || 'Not provided'}
- ACT Composite: ${profile.actScore || 'Not provided'}
- Class Rank / Percentile: ${profile.classRank || 'Not provided'}
- High School Context: ${profile.highSchool || 'Not provided'}
- Country / Origin: ${profile.country || 'International / Undisclosed'}
- Application Cycle: ${profile.applicationCycle || 'Fall 2026'}
- Total Activities: ${ecCount}

EXTRACURRICULARS:
${ecSummary}

EVALUATION OBJECTIVE:
Generate a structured, visually engaging Admissions Intelligence Dossier for ${targetSchool}.
DO NOT output huge monolithic paragraphs. Instead, provide crisp bullet points, quantitative benchmarks, key takeaways, and tactical pro-tips.

Return ONLY a valid, parseable JSON object matching this schema exactly (no markdown backticks, no text outside JSON):
{
  "admitChance": <integer 0-100>,
  "admitTier": "<'Safety' | 'Likely' | 'Target' | 'Reach' | 'High Reach' | 'Extreme Reach'>",
  "verdictHeadline": "<One punchy headline summarizing the admissions stance (e.g. 'Strong Academic Rigor, Needs Differentiated EC Spike')>",
  "verdict": "<2-3 sentence overarching verdict in your chosen persona>",
  "recommendation": "<1-2 sentence highest-leverage strategic recommendation>",
  "benchmarks": [
    {
      "metric": "Unweighted GPA",
      "userVal": "<Student GPA or 'N/A'>",
      "medianVal": "<${targetSchool} Admitted Median GPA, e.g. 3.92>",
      "status": "<'Competitive' | 'In Range' | 'Below Median' | 'Exceptional'>",
      "percentile": "<e.g. '75th' | '50th' | '25th'>"
    },
    {
      "metric": "Standardized Test",
      "userVal": "<Student SAT/ACT or 'Test Optional'>",
      "medianVal": "<${targetSchool} Middle 50% range, e.g. 1510-1560>",
      "status": "<'Competitive' | 'In Range' | 'Below Median' | 'Test Optional'>",
      "percentile": "<e.g. '80th' | '50th' | '30th'>"
    },
    {
      "metric": "Extracurricular Spike",
      "userVal": "<Tier 1-4 rating based on Common App standards>",
      "medianVal": "<Expected Tier for ${targetSchool}, e.g. Tier 1-2>",
      "status": "<'Competitive' | 'In Range' | 'Below Median' | 'Exceptional'>",
      "percentile": "<e.g. '70th' | '45th'>"
    },
    {
      "metric": "Major Selectivity",
      "userVal": "${profile.targetMajor || 'General'}",
      "medianVal": "<Admit rate for this specific major vs overall, e.g. 8.5% admit>",
      "status": "<'High Rigor' | 'Balanced' | 'Selective' | 'Extreme'>",
      "percentile": "<Selectivity band, e.g. Top 10% hardest>"
    }
  ],
  "profileSections": {
    "academics": {
      "score": <integer 0-100>,
      "title": "Academic Rigor & Grades",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of GPA/transcript relative to ${targetSchool}>",
      "takeaways": [
        "<Key observation 1 about GPA, course rigor, or class standing>",
        "<Key observation 2 about how ${targetSchool} evaluates this curriculum>",
        "<Key observation 3 on academic competitiveness>"
      ],
      "proTip": "<1 actionable, concrete tactic to optimize the academic presentation>"
    },
    "testScores": {
      "score": <integer 0-100>,
      "title": "Standardized Testing",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of SAT/ACT or test-optional strategic posture>",
      "takeaways": [
        "<Key observation 1 comparing test scores to ${targetSchool} middle 50%>",
        "<Key observation 2 about test-optional vs score submission impact>",
        "<Key observation 3 regarding superscore or retake viability>"
      ],
      "proTip": "<1 actionable testing strategy tip>"
    },
    "extracurriculars": {
      "score": <integer 0-100>,
      "title": "Extracurricular Spike & Leadership",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of depth, leadership, and uniqueness>",
      "takeaways": [
        "<Key observation 1 evaluating leadership titles and agency>",
        "<Key observation 2 evaluating alignment with intended major>",
        "<Key observation 3 on quantified impact vs typical admitted cohort>"
      ],
      "proTip": "<1 actionable tip to sharpen Common App activity descriptions>"
    },
    "essayPotential": {
      "score": <integer 0-100>,
      "title": "Narrative Identity & Story",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of essay narrative angles available to student>",
      "takeaways": [
        "<Key observation 1 identifying the most compelling story angle>",
        "<Key observation 2 on how to tackle ${targetSchool} specific supplements>",
        "<Key observation 3 on avoiding common applicant tropes>"
      ],
      "proTip": "<1 actionable essay hook or topic prompt suggestion>"
    },
    "researchAndHonors": {
      "score": <integer 0-100>,
      "title": "Research, Awards & Distinctions",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of external academic/creative validation>",
      "takeaways": [
        "<Key observation 1 on presence or absence of state/national honors>",
        "<Key observation 2 on independent research or project portfolio depth>",
        "<Key observation 3 on how ${targetSchool} values intellectual curiosity>"
      ],
      "proTip": "<1 actionable honor/project boost recommendation>"
    },
    "fitAndContext": {
      "score": <integer 0-100>,
      "title": "Institutional Fit & Context",
      "assessment": "<'Exceptional' | 'Strong' | 'Competitive' | 'Below Average' | 'Weak'>",
      "highlight": "<1 sentence summary of how student profile aligns with ${targetSchool} priorities>",
      "takeaways": [
        "<Key observation 1 on demographic, geographic, or international context>",
        "<Key observation 2 on departmental competitiveness for ${profile.targetMajor || 'major'}>",
        "<Key observation 3 on demonstrated interest & community contribution>"
      ],
      "proTip": "<1 actionable institutional alignment tip>"
    }
  },
  "strengths": [
    { "title": "<Strength Title 1>", "desc": "<Concise 1-2 sentence evidence>", "tag": "<'Core Anchor' | 'High Impact' | 'Differentiator'>" },
    { "title": "<Strength Title 2>", "desc": "<Concise 1-2 sentence evidence>", "tag": "<'Leadership' | 'Academic Rigor' | 'Narrative'>" },
    { "title": "<Strength Title 3>", "desc": "<Concise 1-2 sentence evidence>", "tag": "<'Spike' | 'Diversity' | 'Initiative'>" }
  ],
  "weaknesses": [
    { "title": "<Vulnerability Title 1>", "desc": "<Concise 1-2 sentence breakdown of gap>", "severity": "<'High Priority' | 'Medium Priority' | 'Strategic'>" },
    { "title": "<Vulnerability Title 2>", "desc": "<Concise 1-2 sentence breakdown of gap>", "severity": "<'High Priority' | 'Medium Priority' | 'Strategic'>" },
    { "title": "<Vulnerability Title 3>", "desc": "<Concise 1-2 sentence breakdown of gap>", "severity": "<'High Priority' | 'Medium Priority' | 'Strategic'>" }
  ],
  "actionRoadmap": [
    { "phase": "Next 30 Days", "title": "<Immediate action step>", "desc": "<Specific tactical instructions>", "impact": "<e.g. '+5% Odds Boost'>" },
    { "phase": "60 Days Out", "title": "<Mid-term execution step>", "desc": "<Specific tactical instructions>", "impact": "<e.g. '+10% Odds Boost'>" },
    { "phase": "Pre-Submission", "title": "<Final polish & positioning>", "desc": "<Specific tactical instructions>", "impact": "<e.g. '+5% Odds Boost'>" }
  ],
  "comparativeInsight": "<2 sentence analytical synthesis comparing candidate against the admitted median cohort>"
}`;
}

/* ─── Gemini 2.5 API Call (Primary) ─────────────────────────────────── */
async function callGemini(prompt: string): Promise<{ data: any; model: string }> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastErr = null;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.25,
              maxOutputTokens: 4096,
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
          return { data: parsed, model: `Gemini 2.5 (${model})` };
        }
      } else {
        const errText = await res.text();
        console.warn(`[Chance-Me] Gemini model ${model} error:`, res.status, errText);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All Gemini models failed");
}

/* ─── OpenRouter Fallback ───────────────────────────────────────────── */
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
          "X-Title": "Abroad Simplified Chance-Me Predictor"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You are an elite university admissions predictor. Return valid raw JSON ONLY matching the requested structure."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.25,
          max_tokens: 4096
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
        console.warn(`[Chance-Me] OpenRouter ${model} error:`, res.status, errText);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All OpenRouter models failed");
}

/* ─── Local Heuristic Fallback ──────────────────────────────────────── */
function localHeuristicAnalysis(req: ChanceMeRequest) {
  const { profile, targetSchool, spiceLevel } = req;

  let baseChance = 45;
  const gpa = parseFloat(profile.gpa || '0');
  const sat = parseInt(profile.satScore || '0', 10);
  const act = parseInt(profile.actScore || '0', 10);
  const ecs = Array.isArray(profile.extracurriculars) ? profile.extracurriculars : [];

  if (gpa >= 3.9) baseChance += 20;
  else if (gpa >= 3.7) baseChance += 14;
  else if (gpa >= 3.5) baseChance += 8;

  if (sat >= 1530) baseChance += 18;
  else if (sat >= 1480) baseChance += 12;
  else if (sat >= 1400) baseChance += 6;

  if (!sat && act) {
    if (act >= 35) baseChance += 18;
    else if (act >= 33) baseChance += 12;
  }

  if (ecs.length >= 6) baseChance += 10;
  else if (ecs.length >= 3) baseChance += 6;

  const admitChance = Math.min(92, Math.max(6, baseChance));
  const admitTier = admitChance >= 75 ? 'Safety' : admitChance >= 60 ? 'Likely' : admitChance >= 45 ? 'Target' : admitChance >= 25 ? 'Reach' : admitChance >= 12 ? 'High Reach' : 'Extreme Reach';

  const academicScore = Math.min(98, 50 + (gpa >= 3.9 ? 35 : gpa >= 3.7 ? 25 : gpa >= 3.5 ? 15 : 5) + (sat >= 1500 ? 12 : 5));
  const testScore = Math.min(98, sat >= 1550 ? 96 : sat >= 1500 ? 88 : sat >= 1420 ? 76 : sat > 0 ? 60 : 50);
  const ecScore = Math.min(95, 45 + ecs.length * 6 + (ecs.some((e: any) => /president|founder|captain|lead/i.test(JSON.stringify(e))) ? 15 : 0));
  const essayScore = 80;
  const researchScore = Math.min(92, 40 + ecs.filter((e: any) => /research|publish|award|competition|olympiad/i.test(JSON.stringify(e))).length * 18);
  const fitScore = 84;

  const getTierAssessment = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 78) return 'Strong';
    if (score >= 62) return 'Competitive';
    if (score >= 45) return 'Below Average';
    return 'Weak';
  };

  const headlines: Record<string, string> = {
    gentle: `Promising Candidacy with Clear Pathways to Distinguish Your Application at ${targetSchool}`,
    candid: `Competitive Academic Profile — Needs Sharper Narrative Spike for ${targetSchool}`,
    roast: `Solid Numbers on Paper, But Blends Into the 40,000 Other Identical Resumes`
  };

  const verdicts: Record<string, string> = {
    gentle: `You have built a very solid foundation for ${targetSchool}. Your academic record demonstrates real dedication, and with focused positioning around your passions, you will present a compelling, authentic voice.`,
    candid: `Your numbers put you in legitimate contention at ${targetSchool}, but numbers only earn you a first read. In a pool where 80% of applicants have near-perfect stats, your essays and activity spike will determine whether you get admitted.`,
    roast: `Look, your stats won't get you thrown in the immediate reject bin, but they won't make anyone jump out of their chair either. If you submit a generic essay, you will be waitlisted faster than you can say Common App.`
  };

  return {
    admitChance,
    admitTier,
    verdictHeadline: headlines[spiceLevel] || headlines.candid,
    verdict: verdicts[spiceLevel] || verdicts.candid,
    recommendation: `Prioritize quantifying the impact of your top 3 extracurricular activities with hard metrics, and anchor your ${targetSchool} supplemental essays to specific undergraduate research laboratories.`,
    benchmarks: [
      {
        metric: "Unweighted GPA",
        userVal: profile.gpa || "3.85",
        medianVal: "3.92",
        status: gpa >= 3.9 ? "Exceptional" : gpa >= 3.7 ? "Competitive" : "Below Median",
        percentile: gpa >= 3.9 ? "80th" : gpa >= 3.7 ? "65th" : "35th"
      },
      {
        metric: "Standardized Test",
        userVal: profile.satScore ? `${profile.satScore} SAT` : profile.actScore ? `${profile.actScore} ACT` : "Test Optional",
        medianVal: "1510 - 1560",
        status: sat >= 1520 ? "Competitive" : sat >= 1450 ? "In Range" : sat > 0 ? "Below Median" : "Test Optional",
        percentile: sat >= 1520 ? "75th" : sat >= 1450 ? "50th" : "30th"
      },
      {
        metric: "Extracurricular Spike",
        userVal: ecs.length >= 6 ? "Tier 2 (Strong Leadership)" : "Tier 3 (School Level)",
        medianVal: "Tier 1 - Tier 2",
        status: ecs.length >= 6 ? "Competitive" : "Below Median",
        percentile: ecs.length >= 6 ? "65th" : "40th"
      },
      {
        metric: "Intended Major Rigor",
        userVal: profile.targetMajor || "Computer Science",
        medianVal: "High Selectivity (~9% Admit)",
        status: "High Rigor",
        percentile: "Top 15% Competition"
      }
    ],
    profileSections: {
      academics: {
        score: academicScore,
        title: "Academic Rigor & Transcript",
        assessment: getTierAssessment(academicScore),
        highlight: `GPA of ${profile.gpa || '3.8+'} clears the primary academic threshold for ${targetSchool}.`,
        takeaways: [
          `Unweighted GPA reflects consistent achievement across core disciplines.`,
          `Coursework demonstrates participation in honors/advanced classes.`,
          `Academic index meets the baseline requirements for holistic review.`
        ],
        proTip: `Highlight any upward grade trends in STEM coursework within the additional info section.`
      },
      testScores: {
        score: testScore,
        title: "Standardized Testing",
        assessment: getTierAssessment(testScore),
        highlight: sat > 0 ? `SAT score of ${profile.satScore} provides solid quantitative credibility.` : `Test-optional positioning requires stronger course validation.`,
        takeaways: [
          sat > 0 ? `Composite score aligns with the middle 50% threshold of admitted classes.` : `Submitting a 1500+ score would significantly increase your probability.`,
          `Math and Evidence-Based Reading subscores demonstrate balanced academic preparation.`,
          `Test submission strategy aligns with current admissions committee preferences.`
        ],
        proTip: sat >= 1480 ? `Submit your scores with confidence — they support your academic profile.` : `Target a 30-50 point improvement if testing again before the deadline.`
      },
      extracurriculars: {
        score: ecScore,
        title: "Extracurricular Impact & Spike",
        assessment: getTierAssessment(ecScore),
        highlight: `Portfolio includes ${ecs.length} listed activities showing consistent multi-year engagement.`,
        takeaways: [
          `Demonstrated leadership roles indicate agency and peer collaboration.`,
          `Activities show meaningful breadth, with opportunities to deepen major-specific alignment.`,
          `Descriptions will benefit from concrete, quantified metrics (e.g. people reached, funding raised).`
        ],
        proTip: `Order your activities so that your major-aligned 'spike' occupies the top 2 slots on Common App.`
      },
      essayPotential: {
        score: essayScore,
        title: "Personal Narrative & Voice",
        assessment: getTierAssessment(essayScore),
        highlight: `Unique experiences provide fertile ground for a memorable personal statement.`,
        takeaways: [
          `Your personal story offers distinctive angles that stand out against peer applicants.`,
          `Supplemental essays for ${targetSchool} must explicitly name unique labs and professors.`,
          `Focus on intellectual vitality rather than recounting resume accomplishments.`
        ],
        proTip: `Anchor your 'Why Us' supplement to 2 specific research centers or experiential programs at ${targetSchool}.`
      },
      researchAndHonors: {
        score: researchScore,
        title: "Research, Honors & Distinctions",
        assessment: getTierAssessment(researchScore),
        highlight: `External distinctions represent the highest leverage opportunity to elevate your profile.`,
        takeaways: [
          `Local and school-level recognitions are present and validate engagement.`,
          `Pursuing state/national competitions or publishing independent projects will distinguish your file.`,
          `${targetSchool} places high value on self-directed intellectual curiosity outside the classroom.`
        ],
        proTip: `Package any personal coding, writing, or design projects into a verifiable online portfolio link.`
      },
      fitAndContext: {
        score: fitScore,
        title: "Institutional Fit & Selectivity",
        assessment: getTierAssessment(fitScore),
        highlight: `Strong contextual narrative alignment with ${targetSchool}'s interdisciplinary culture.`,
        takeaways: [
          `Applicant background brings valuable geographic and cultural perspectives to the incoming cohort.`,
          `Program competition for ${profile.targetMajor || 'intended major'} is intense; narrative differentiation is essential.`,
          `Demonstrating genuine familiarity with campus initiatives reinforces applicant authenticity.`
        ],
        proTip: `Engage with official department events or faculty webinars to demonstrate informed interest.`
      }
    },
    strengths: [
      { title: "Academic Credibility", desc: "GPA and course trajectory meet the benchmark for initial holistic review.", tag: "Core Anchor" },
      { title: "Sustained Commitment", desc: "Multi-year extracurricular track record shows reliability and genuine focus.", tag: "Leadership" },
      { title: "Strategic Intent", desc: "Clear academic direction provides an intuitive theme for essay supplements.", tag: "Differentiator" }
    ],
    weaknesses: [
      { title: "Spike Differentiation", desc: "Extracurricular profile lacks a defining national-level distinction in a competitive field.", severity: "High Priority" },
      { title: "Quantified Metrics", desc: "Activity descriptions need stronger emphasis on measurable outcomes and scope.", severity: "Medium Priority" },
      { title: "Major Competitiveness", desc: `Intended major (${profile.targetMajor || 'STEM'}) has higher selectivity than university baseline.`, severity: "Strategic" }
    ],
    actionRoadmap: [
      { phase: "Next 30 Days", title: "Revamp Common App Activity Descriptions", desc: "Rewrite top 5 activities using strong action verbs and quantified impact metrics (hours, revenue, users).", impact: "+5% Odds Boost" },
      { phase: "60 Days Out", title: "Tailor Supplemental Essays to Specific Faculty", desc: `Research and reference 2 specific research centers and professors unique to ${targetSchool}.`, impact: "+10% Odds Boost" },
      { phase: "Pre-Submission", title: "Synthesize Recommender Brag Sheet", desc: "Equip teachers with an anecdote sheet highlighting your classroom leadership and curiosity.", impact: "+5% Odds Boost" }
    ],
    comparativeInsight: `Against the median admitted cohort at ${targetSchool}, your academic statistics position you competitively in the middle 50% pool. Your primary opportunity for admission lies in presenting a memorable, cohesive personal narrative that differentiates your extracurricular leadership.`
  };
}

/* ─── POST Handler ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body: ChanceMeRequest = await req.json();
    const { targetSchool, profile } = body;

    if (!targetSchool) {
      return NextResponse.json(
        { error: "Target school is required" },
        { status: 400 }
      );
    }

    const prompt = buildChanceMePrompt(body);

    // 1. PRIMARY: Gemini 2.5 Flash
    try {
      console.log("[Chance-Me] 1. Executing Gemini 2.5 Flash primary evaluation...");
      const result = await callGemini(prompt);
      return NextResponse.json({
        success: true,
        data: result.data,
        provider: result.model
      });
    } catch (geminiErr: any) {
      console.warn("[Chance-Me] Gemini 2.5 failed, falling back to OpenRouter:", geminiErr?.message || geminiErr);
    }

    // 2. FALLBACK: OpenRouter
    try {
      console.log("[Chance-Me] 2. Executing OpenRouter fallback...");
      const result = await callOpenRouter(prompt);
      return NextResponse.json({
        success: true,
        data: result.data,
        provider: result.model
      });
    } catch (openRouterErr: any) {
      console.warn("[Chance-Me] OpenRouter failed, falling back to local heuristic:", openRouterErr?.message || openRouterErr);
    }

    // 3. FALLBACK: Heuristic Engine
    const heuristicData = localHeuristicAnalysis(body);
    return NextResponse.json({
      success: true,
      data: heuristicData,
      provider: "Abroad Simplified Heuristic Engine"
    });

  } catch (error: any) {
    console.error("[Chance-Me] Fatal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate admission chances" },
      { status: 500 }
    );
  }
}
