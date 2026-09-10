import mongoose from "mongoose";
import StudentProfile from "../models/StudentProfile.js";
import { calculateOpportunityMatch } from "../utils/matchEngine.js";
import { generateRoadmapForGaps } from "../services/geminiService.js";

/**
 * POST /api/roadmaps/generate
 * Generates an AI-driven learning roadmap for a student targeting an opportunity.
 */
export const generateRoadmap = async (req, res) => {
  try {
    const { studentId, opportunityId } = req.body;

    if (!studentId || !opportunityId) {
      return res.status(400).json({
        success: false,
        error: "Both studentId and opportunityId are required in the request body.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid studentId or opportunityId format.",
      });
    }

    // 1. Calculate match and obtain gap details using matchEngine
    let matchResult;
    try {
      matchResult = await calculateOpportunityMatch(opportunityId, studentId);
    } catch (err) {
      return res.status(err.status || 500).json({
        success: false,
        error: err.message,
      });
    }

    const { studentProfile, score: matchScore, detailedGaps = [] } = matchResult;

    // 2. If no gaps, return early with current roadmap
    if (detailedGaps.length === 0) {
      return res.status(200).json({
        success: true,
        matchScore,
        gapsCount: 0,
        message: "Student meets all required skill levels. No skill gaps found.",
        roadmap: studentProfile.roadmap,
      });
    }

    // 3. Call Gemini service to generate targeted roadmap items
    const generatedRoadmap = await generateRoadmapForGaps(detailedGaps);

    // 4. Cache/save directly to StudentProfile.roadmap
    studentProfile.roadmap = generatedRoadmap;
    await studentProfile.save();

    return res.status(200).json({
      success: true,
      matchScore,
      gapsCount: detailedGaps.length,
      roadmap: studentProfile.roadmap,
    });
  } catch (error) {
    console.error("generateRoadmap error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate roadmap.",
    });
  }
};

/**
 * GET /api/roadmaps/student/:studentId
 * Fetches a student's current learning roadmap with populated relatedSkill details.
 */
export const getStudentRoadmap = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid studentId format.",
      });
    }

    const studentProfile = await StudentProfile.findOne({
      $or: [{ user: studentId }, { _id: studentId }],
    }).populate("roadmap.relatedSkill", "name category");

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        error: "Student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      roadmap: studentProfile.roadmap,
    });
  } catch (error) {
    console.error("getStudentRoadmap error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch student roadmap.",
    });
  }
};

/**
 * PATCH /api/roadmaps/student/:studentId/item/:itemId
 * Updates the completion status (done: boolean) of a roadmap item.
 */
export const updateRoadmapItemStatus = async (req, res) => {
  try {
    const { studentId, itemId } = req.params;
    const { done } = req.body;

    if (typeof done !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Field 'done' (boolean) is required in request body.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid studentId format.",
      });
    }

    const studentProfile = await StudentProfile.findOne({
      $or: [{ user: studentId }, { _id: studentId }],
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        error: "Student profile not found.",
      });
    }

    // Locate roadmap item by subdocument _id, relatedSkill ObjectId, or array index
    const item = (studentProfile.roadmap || []).find((it, idx) => {
      if (it._id && it._id.toString() === itemId) return true;
      if (it.relatedSkill && it.relatedSkill.toString() === itemId) return true;
      if (String(idx) === itemId) return true;
      return false;
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Roadmap item '${itemId}' not found in student roadmap.`,
      });
    }

    item.done = done;
    await studentProfile.save();

    return res.status(200).json({
      success: true,
      item,
      roadmap: studentProfile.roadmap,
    });
  } catch (error) {
    console.error("updateRoadmapItemStatus error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update roadmap item.",
    });
  }
};
