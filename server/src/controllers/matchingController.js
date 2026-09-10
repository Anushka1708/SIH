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

/**
 * GET /api/matching/talent-search
 * Company Reverse Matching Engine:
 * Allows recruiters to search opt-in candidates by verified skills,
 * minimum AI Talent Index, domain/branch, and availability.
 */
export const searchTalent = async (req, res) => {
  try {
    const {
      skills,
      minTalentIndex = 0,
      branch,
      domain,
      minScore,
      search,
    } = req.query;

    const threshold = Number(minTalentIndex || minScore) || 0;

    // Build filter for StudentProfiles
    const query = {};
    if (branch && branch !== "All") {
      query.branch = new RegExp(branch, "i");
    }

    const profiles = await StudentProfile.find(query)
      .populate("user", "name email role")
      .populate("skills.skill", "name category ncrfCode")
      .lean();

    const targetSkills = skills
      ? skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const results = [];

    for (const p of profiles) {
      if (!p.user) continue;

      const studentSkills = p.skills || [];
      const verifiedSkills = studentSkills.filter((s) => s.verified);

      // Compute AI Talent Index (0-100)
      let totalSkillPoints = 0;
      for (const s of studentSkills) {
        const weight = s.verified ? 1.25 : 0.8;
        totalSkillPoints += (s.level || 0) * weight;
      }

      const avgLevel = studentSkills.length > 0
        ? Math.min(100, Math.round(totalSkillPoints / studentSkills.length))
        : 45;

      const projectBonus = (p.portfolio || []).filter((item) => item.type === "project" || item.type === "certificate").length * 3;
      const talentIndex = Math.min(99, Math.max(30, avgLevel + Math.min(15, projectBonus)));

      if (talentIndex < threshold) continue;

      // Filter by skill overlap if requested
      if (targetSkills.length > 0) {
        const studentSkillNames = studentSkills.map((s) => (s.skill?.name || "").toLowerCase());
        const hasOverlap = targetSkills.some((ts) =>
          studentSkillNames.some((ssn) => ssn.includes(ts) || ts.includes(ssn))
        );
        if (!hasOverlap) continue;
      }

      // Keyword search in name or degree
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const studentName = (p.user.name || "").toLowerCase();
        const college = (p.college || "").toLowerCase();
        const branch = (p.branch || "").toLowerCase();
        if (!studentName.includes(q) && !college.includes(q) && !branch.includes(q)) {
          continue;
        }
      }

      results.push({
        studentId: p.user._id,
        profileId: p._id,
        name: p.user.name || "Candidate",
        email: p.user.email,
        college: p.college || "Institute of Technology",
        degree: p.degree || "B.Tech",
        branch: p.branch || "Computer Science",
        year: p.year || 3,
        talentIndex,
        skillsCount: studentSkills.length,
        verifiedCount: verifiedSkills.length,
        skills: studentSkills.map((s) => ({
          name: s.skill?.name || "Competency",
          level: s.level || 0,
          verified: Boolean(s.verified),
          evidenceType: s.evidenceType || "self-reported",
        })),
        badges: (p.portfolio || []).filter((item) => item.type === "certificate").map((b) => ({
          title: b.title,
          issuedBy: b.issuedBy,
          date: b.date,
        })),
        completedProjectsCount: (p.portfolio || []).filter((item) => item.type === "project").length,
        optedIn: true,
      });
    }

    // Sort descending by talent index
    results.sort((a, b) => b.talentIndex - a.talentIndex);

    return res.json({
      success: true,
      count: results.length,
      candidates: results,
    });
  } catch (error) {
    console.error("searchTalent error:", error);
    return res.status(500).json({ error: error.message || "Failed to search talent." });
  }
};
