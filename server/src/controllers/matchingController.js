import mongoose from "mongoose";
import StudentProfile from "../models/StudentProfile.js";
import Opportunity from "../models/Opportunity.js";
import LiveProject from "../models/LiveProject.js";
import { computeMatch } from "../utils/matchEngine.js";

/**
 * GET /api/matching/opportunity/:opportunityId/student/:studentId
 * Computes explainable match score between a student and an Opportunity.
 * Updates matchScore and matchReasoning on Opportunity.applicants[] if applicant exists.
 */
export const matchStudentToOpportunity = async (req, res) => {
  try {
    const { opportunityId, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(opportunityId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid opportunityId or studentId format." });
    }

    // Student profile can be referenced by its User id or its own _id
    const studentProfile = await StudentProfile.findOne({
      $or: [{ user: studentId }, { _id: studentId }],
    }).populate("skills.skill", "name");

    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const opportunity = await Opportunity.findById(opportunityId).populate(
      "requiredSkills.skill",
      "name"
    );

    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found." });
    }

    // Normalize Opportunity.requiredSkills directly (already has minLevel & weight)
    const normalizedRequired = (opportunity.requiredSkills || []).map((rs) => ({
      skillId: rs.skill?._id || rs.skill,
      skillName: rs.skill?.name || "Unknown",
      minLevel: rs.minLevel !== undefined ? rs.minLevel : 50,
      weight: rs.weight !== undefined ? rs.weight : 1,
    }));

    const result = computeMatch(studentProfile.skills, normalizedRequired);

    // If an applicant entry exists for this student, write matchScore & matchReasoning
    const applicant = opportunity.applicants?.find(
      (a) =>
        a.student?.toString() === studentId ||
        a.student?.toString() === studentProfile.user?.toString()
    );

    if (applicant) {
      applicant.matchScore = result.score;
      applicant.matchReasoning = result.reasoning;
      await opportunity.save();
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/matching/project/:projectId/student/:studentId
 * Computes explainable match score between a student and a LiveProject (read-only).
 */
export const matchStudentToProject = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid projectId or studentId format." });
    }

    const studentProfile = await StudentProfile.findOne({
      $or: [{ user: studentId }, { _id: studentId }],
    }).populate("skills.skill", "name");

    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const project = await LiveProject.findById(projectId).populate("requiredSkills", "name");

    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    // LiveProject.requiredSkills is a plain array of Skill ObjectId refs.
    // Normalize to { skillId, skillName, minLevel: 50, weight: 1 }
    const normalizedRequired = (project.requiredSkills || []).map((skill) => ({
      skillId: skill?._id || skill,
      skillName: skill?.name || "Unknown",
      minLevel: 50,
      weight: 1,
    }));

    const result = computeMatch(studentProfile.skills, normalizedRequired);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
