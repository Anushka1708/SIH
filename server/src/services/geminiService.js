import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates an actionable roadmap for closing student skill gaps via Gemini 1.5 Flash.
 *
 * @param {Array<{skillName: string, skillId: string, currentLevel: number, requiredLevel: number, gapSize: number}>} gaps
 * @returns {Promise<Array<{title: string, description: string, relatedSkill: string, done: boolean}>>}
 */
export const generateRoadmapForGaps = async (gaps = []) => {
  if (!gaps || gaps.length === 0) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  // Sort gaps by largest gap size first
  const sortedGaps = [...gaps].sort((a, b) => (b.gapSize || 0) - (a.gapSize || 0));

  const prompt = `You are an expert academic and industry career advisor in India.
Analyze the following skill gaps identified for a student seeking eligibility for career opportunities:

${JSON.stringify(sortedGaps, null, 2)}

For each skill gap (prioritizing the largest gaps first), recommend 1 to 2 targeted, high-quality, free courses focusing on Indian government platforms (e.g., SWAYAM, NPTEL) or reputable open courseware.

Output requirements:
Return a valid JSON array of objects conforming exactly to this schema:
[
  {
    "title": "Course or module title (include platform name, e.g. [NPTEL] or [SWAYAM])",
    "description": "Concise summary of the course content and how it bridges the gap from the student's current level to the required level.",
    "relatedSkill": "The exact skillId string corresponding to this gap",
    "done": false
  }
]

Do not include any conversational text. Return only the raw JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean markdown code fences if present (```json ... ``` or ``` ... ```)
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    }

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid response structure from Gemini: expected an array.");
    }

    // Enforce strict schema conformity for StudentProfile.roadmap
    const roadmap = parsed.map((item) => ({
      title: String(item.title || "Targeted Skill Course"),
      description: String(item.description || ""),
      relatedSkill: item.relatedSkill ? String(item.relatedSkill) : undefined,
      done: false,
    }));

    return roadmap;
  } catch (error) {
    console.error("Gemini roadmap generation error:", error.message);
    throw new Error(`Failed to generate roadmap: ${error.message}`);
  }
};
