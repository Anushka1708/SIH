import express from "express";
import { protect } from "../middleware/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import StudentProfile from "../models/StudentProfile.js";

const router = express.Router();

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Fetch user student profile for live context
    let studentContext = "";
    if (user?.role === "student") {
      const profile = await StudentProfile.findOne({ user: user._id }).populate("skills.skill");
      if (profile) {
        const skillsList = (profile.skills || []).map(
          (s) => `${s.skill?.name || "Skill"} (${s.level || 0}%, ${s.verified ? "Verified" : "Unverified"})`
        );
        studentContext = `User Student Details:
- Name: ${user.name}
- College: ${profile.college || "University"}
- Degree/Branch: ${profile.degree || "B.Tech"} ${profile.branch || "CSE"}
- Verified Skills & Vector: ${skillsList.join(", ") || "None"}
- Target Roles: ${(profile.targetRoles || []).join(", ") || "Full Stack Developer"}
- Active Milestones: ${(profile.roadmap || []).map((r) => r.title).join("; ") || "General Roadmap"}`;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          generationConfig: {
            temperature: 0.3,
          },
        });

        const prompt = `You are the SkillBridge AI Assistant and Career Mentor for Indian higher education and Smart India Hackathon (SIH) candidate workflows.
Context of logged-in user:
Role: ${user?.role || "student"}
Name: ${user?.name || "User"}
${studentContext}

Guidelines:
1. Provide concise, helpful, and technically accurate responses (2 to 4 sentences or brief bullet points).
2. You can answer arbitrary general questions (mathematics, programming concepts, architecture, career paths) as well as platform guidance.
3. If relevant, mention platform features: 'Skills & Assessment' to take quizzes, 'Opportunities' for job matches, 'Live Industry Projects' for corporate problem statements, 'Learning Programs' for YouTube tutorials.
4. Keep the tone inspiring, professional, and supportive.

User Query: "${message}"
`;

        const result = await model.generateContent(prompt);
        const replyText = result.response.text().trim();

        return res.json({
          reply: replyText,
          source: "gemini-3.6-flash",
        });
      } catch (geminiErr) {
        console.warn("Gemini chatbot error, using dynamic fallback:", geminiErr.message);
      }
    }

    // Fallback dynamic response
    return res.json({
      reply: `Hello ${user?.name || "there"}! Based on your SkillBridge profile, you can explore live opportunities matching your skill vector or take assessments under 'Skills & Assessment' to earn verified badges. Let me know if you need help with a specific programming concept or roadmap milestone!`,
      source: "fallback",
    });
  } catch (error) {
    console.error("AI Chat route error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

export default router;
