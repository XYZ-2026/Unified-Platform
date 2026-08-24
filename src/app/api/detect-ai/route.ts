import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/apiConfig";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/** Local heuristic scorer — used as fallback when Gemini is unavailable */
function heuristicAiScore(text: string): {
  percentage: number;
  confidence: "low" | "medium" | "high";
  reasoning: string;
} {
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  if (totalWords < 10) {
    return { percentage: 0, confidence: "low", reasoning: "Text is too short for analysis." };
  }

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const totalSentences = sentences.length;

  // 1. Transition words density (per word)
  const aiPhrases = [
    /\bfurthermore\b/gi,
    /\bmoreover\b/gi,
    /\badditionally\b/gi,
    /\bconsequently\b/gi,
    /\bin conclusion\b/gi,
    /\bit is (worth noting|important to note)\b/gi,
    /\bthis (paper|study|research) (aims|seeks|investigates|presents|proposes)\b/gi,
    /\bnovel approach\b/gi,
    /\brobust (framework|method|approach|system)\b/gi,
    /\bstate-of-the-art\b/gi,
    /\bsignificant(ly)?\b/gi,
    /\bdelve\b/gi,
    /\btapestry\b/gi,
    /\bbeacons\b/gi,
    /\btestament\b/gi,
    /\bnot only\b/gi,
    /\bbut also\b/gi,
  ];
  const phraseCount = aiPhrases.reduce(
    (n, rx) => n + (text.match(rx) || []).length,
    0
  );
  
  // Transition phrase density (normally 0.5% - 2.5% in AI text)
  const transitionDensity = phraseCount / totalWords;
  let transitionScore = 0;
  if (transitionDensity > 0.02) {
    transitionScore = 100;
  } else if (transitionDensity > 0.005) {
    transitionScore = 50 + ((transitionDensity - 0.005) / 0.015) * 50;
  } else {
    transitionScore = (transitionDensity / 0.005) * 50;
  }

  // 2. Sentence length variation (standard deviation)
  let sentenceLengthScore = 50;
  if (totalSentences >= 3) {
    const lens = sentences.map((s) => s.trim().split(/\s+/).length);
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const variance = lens.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lens.length;
    const stdDev = Math.sqrt(variance);
    
    // AI has low stdDev (e.g. < 4). Human has high stdDev (e.g. > 8).
    if (stdDev < 3.5) {
      sentenceLengthScore = 90 + (3.5 - stdDev) * 2;
    } else if (stdDev > 9) {
      sentenceLengthScore = Math.max(10, 30 - (stdDev - 9) * 2);
    } else {
      // Linear mapping from 9 (low AI likelihood) to 3.5 (high AI likelihood)
      sentenceLengthScore = 30 + ((9 - stdDev) / 5.5) * 60;
    }
  }

  // 3. Passive voice ratio
  const passiveMatches = (
    text.match(/\b(is|are|was|were|been|be)\s+\w+ed\b/gi) || []
  ).length;
  const passiveRatio = passiveMatches / Math.max(totalSentences, 1);
  // High passive ratio (> 0.45) is typical for AI. Low is typical for human.
  let passiveScore = 0;
  if (passiveRatio > 0.5) {
    passiveScore = 90;
  } else {
    passiveScore = (passiveRatio / 0.5) * 90;
  }

  // 4. Vocabulary distribution (Long words ratio)
  const longWords = words.filter((w) => w.length > 8).length;
  const longWordRatio = longWords / totalWords;
  // AI typically has > 22% long words. Human typically has < 15%.
  let vocabScore = 50;
  if (longWordRatio > 0.24) {
    vocabScore = 85;
  } else if (longWordRatio < 0.12) {
    vocabScore = 20;
  } else {
    vocabScore = 20 + ((longWordRatio - 0.12) / 0.12) * 65;
  }

  // Combine scores with weights
  // Transition phrases (35%), Sentence variance (35%), Passive ratio (15%), Vocabulary (15%)
  let combinedScore = Math.round(
    transitionScore * 0.35 +
    sentenceLengthScore * 0.35 +
    passiveScore * 0.15 +
    vocabScore * 0.15
  );

  // Apply a dynamic small jitter (e.g. +/- 3%) based on hash of text length to make it feel natural and not completely static
  const textHash = text.length % 7;
  const jitter = textHash - 3; // -3% to +3%
  combinedScore = Math.max(12, Math.min(94, combinedScore + jitter));

  // Determine confidence and reasoning dynamically
  let confidence: "low" | "medium" | "high" = "medium";
  let reasoning = "";
  if (combinedScore > 75) {
    reasoning = `Highly uniform sentence lengths and high density of technical transition words indicate likely AI origin.`;
    confidence = "high";
  } else if (combinedScore < 35) {
    reasoning = `Natural variation in sentence length and organic language flow suggest human authorship.`;
    confidence = "high";
  } else {
    reasoning = `Mixed signals detected: academic transition words are present alongside natural variations in style.`;
    confidence = "medium";
  }

  return {
    percentage: combinedScore,
    confidence,
    reasoning,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { text, pdfBase64 } = await req.json();

    if (!text && !pdfBase64) {
      return NextResponse.json(
        { error: "Missing or invalid payload: must contain either 'text' or 'pdfBase64'" },
        { status: 400 }
      );
    }

    let trimmedText = "";
    let wordCount = 0;

    if (text) {
      trimmedText = text.trim();
      wordCount = trimmedText.split(/\s+/).filter(Boolean).length;

      if (wordCount < 30) {
        return NextResponse.json({
          percentage: 0,
          confidence: "low",
          reasoning: "Not enough text to analyze (minimum 30 words required).",
          wordCount,
        });
      }
    } else if (pdfBase64) {
      try {
        const extractRes = await fetch(`${API_BASE_URL}/extract-pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdf_base64: pdfBase64 }),
        });
        if (extractRes.ok) {
          const extractData = await extractRes.json();
          if (extractData.text) {
            trimmedText = extractData.text.trim();
            wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
          }
        } else {
          console.warn("Failed to extract text from PDF on Python backend:", extractRes.status);
        }
      } catch (extractErr) {
        console.warn("Error calling PDF text extraction backend:", extractErr);
      }

      if (wordCount < 30) {
        return NextResponse.json({
          percentage: 0,
          confidence: "low",
          reasoning: "Not enough text extracted from the PDF to analyze (minimum 30 words required).",
          wordCount,
        });
      }
    }

    // ── Try Gemini ────────────────────────────────────────────────────
    if (GEMINI_API_KEY) {
      try {
        const prompt = `You are an expert AI-content detection system. Analyze the following academic text and determine what percentage of it was likely generated by an AI language model (such as GPT-4, Claude, Gemini, etc.) versus written by a human.

Consider these signals of AI-generated text:
- Overly formal, homogeneous sentence structures
- Perfect transitions and logical flow that feels templated
- Lack of personal voice, hedging, or uncertainty
- Use of bullet points with parallel "Furthermore", "Moreover", "Additionally" style
- Formulaic academic phrasing without domain-specific nuance
- Very even vocabulary distribution (no rare words, no slang)
- Repetitive clause structures

Consider these signals of human-written text:
- Natural variation in sentence length and complexity
- Minor imperfections or stylistic quirks
- Domain-specific terminology used with precision
- Organic flow of ideas with tangential observations
- Mixed formality levels

TEXT TO ANALYZE:
---
${
  trimmedText.split(/\s+/).length > 2000
    ? trimmedText.split(/\s+/).slice(0, 2000).join(" ") + "..."
    : trimmedText
}
---

Respond ONLY with a JSON object in this exact format (no markdown, no explanation, just raw JSON):
{"percentage": <integer 0-100>, "confidence": "<low|medium|high>", "reasoning": "<one concise sentence explaining the key reason for this score>"}`;

        const parts: any[] = [{ text: prompt }];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 256,
                topP: 0.8,
              },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const rawText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const percentage = Math.max(
              0,
              Math.min(100, parseInt(parsed.percentage, 10))
            );
            const confidence = ["low", "medium", "high"].includes(
              parsed.confidence
            )
              ? (parsed.confidence as "low" | "medium" | "high")
              : "medium";
            const reasoning =
              typeof parsed.reasoning === "string" ? parsed.reasoning : "";
            return NextResponse.json({
              percentage,
              confidence,
              reasoning,
              wordCount,
            });
          }
        } else {
          console.warn(
            "Gemini API non-OK:",
            response.status,
            await response.text()
          );
        }
      } catch (geminiErr) {
        console.warn(
          "AI detection: falling back to heuristic scorer",
          geminiErr
        );
      }
    }

    if (!trimmedText) {
      throw new Error("No text content available to score.");
    }

    // ── Fallback: local heuristic ─────────────────────────────────────
    const fallback = heuristicAiScore(trimmedText);
    return NextResponse.json({ ...fallback, wordCount, fallback: true });
  } catch (err: any) {
    console.error("AI detection error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
