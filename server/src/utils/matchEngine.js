import StudentProfile from "../models/StudentProfile.js";
import Opportunity from "../models/Opportunity.js";

/**
 * Skill Gap & Explainable Matching Engine
 * Compares a student's verified/evidence-derived skill vector against required skills.
 *
 * @param {Array} studentSkills - Populated StudentProfile.skills[] ({ skill: { _id, name }, level, ... })
 * @param {Array} requiredSkills - Normalized array of { skillId, skillName, minLevel, weight }
 * @returns {Object} { score: number, matched: string[], gaps: string[], reasoning: string }
 */
export const computeMatch = (studentSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 100,
      matched: [],
      gaps: [],
      detailedGaps: [],
      reasoning: "100% match: meets all required skills",
      evidenceBreakdown: {
        assessmentCount: 0,
        projectCount: 0,
        facultySignoffCount: 0,
        selfReportedCount: 0,
        evidenceWeight: 100,
        verifiedSkillsCount: 0,
      },
      skillOverlap: {
        matchedCount: 0,
        totalRequired: 0,
        overlapPercentage: 100,
      },
    };
  }

  let totalWeight = 0;
  let totalContribution = 0;
  const matched = [];
  const gaps = [];
  const detailedGaps = [];

  // Map studentSkills by skill ObjectId string for quick lookup
  const studentSkillMap = new Map();
  let assessmentCount = 0;
  let projectCount = 0;
  let facultySignoffCount = 0;
  let selfReportedCount = 0;
  let verifiedSkillsCount = 0;

  for (const entry of studentSkills) {
    const id = (entry?.skill?._id || entry?.skill)?.toString();
    if (id) {
      studentSkillMap.set(id, entry);
    }
    if (entry?.verified) {
      verifiedSkillsCount++;
    }
    const evType = entry?.evidenceType || (entry?.verified ? "assessment" : "self-reported");
    if (evType === "assessment") assessmentCount++;
    else if (evType === "project") projectCount++;
    else if (evType === "faculty-signoff") facultySignoffCount++;
    else selfReportedCount++;
  }

  for (const req of requiredSkills) {
    const skillId = req.skillId?.toString();
    const skillName = req.skillName || "Unknown Skill";
    const minLevel = req.minLevel !== undefined && req.minLevel > 0 ? req.minLevel : 50;
    const weight = req.weight !== undefined && req.weight >= 0 ? req.weight : 1;

    totalWeight += weight;

    const studentEntry = skillId ? studentSkillMap.get(skillId) : null;
    const studentLevel = studentEntry && typeof studentEntry.level === "number" ? studentEntry.level : 0;
    const isVerified = Boolean(studentEntry?.verified);
    const evType = studentEntry?.evidenceType || (isVerified ? "assessment" : "self-reported");

    if (studentEntry) {
      const ratio = minLevel > 0 ? studentLevel / minLevel : 1;
      const contribution = weight * Math.min(1, Math.max(0, ratio));
      totalContribution += contribution;

      if (studentLevel >= minLevel) {
        matched.push(skillName);
      } else {
        gaps.push(skillName);
        detailedGaps.push({
          skillName,
          skillId,
          currentLevel: studentLevel,
          requiredLevel: minLevel,
          gapSize: minLevel - studentLevel,
          isVerified,
          evidenceType: evType,
        });
      }
    } else {
      // Not found in student's skills
      gaps.push(skillName);
      detailedGaps.push({
        skillName,
        skillId,
        currentLevel: 0,
        requiredLevel: minLevel,
        gapSize: minLevel,
        isVerified: false,
        evidenceType: "missing",
      });
    }
  }

  const score = totalWeight > 0 ? Math.round((totalContribution / totalWeight) * 100) : 0;

  // Calculate Evidence Weight percentage
  const totalEvidenceItems = assessmentCount + projectCount + facultySignoffCount + selfReportedCount;
  const verifiedItems = assessmentCount + projectCount + facultySignoffCount;
  const evidenceWeight = totalEvidenceItems > 0 
    ? Math.round((verifiedItems / totalEvidenceItems) * 100) 
    : (verifiedSkillsCount > 0 ? 85 : 40);

  const skillOverlap = {
    matchedCount: matched.length,
    totalRequired: requiredSkills.length,
    overlapPercentage: Math.round((matched.length / requiredSkills.length) * 100),
  };

  // Build human-readable reasoning string
  const topMatched = matched.slice(0, 3).join(", ");
  const topGaps = gaps.slice(0, 2).join(", ");

  let reasoning = "";
  if (matched.length > 0 && gaps.length > 0) {
    reasoning = `${score}% match (${matched.length}/${requiredSkills.length} skills): strong in ${topMatched}, missing ${topGaps}. Evidence confidence: ${evidenceWeight}%.`;
  } else if (matched.length > 0 && gaps.length === 0) {
    reasoning = `${score}% match (${matched.length}/${requiredSkills.length} skills): meets all required skills with ${evidenceWeight}% verified evidence weight.`;
  } else if (matched.length === 0 && gaps.length > 0) {
    reasoning = `${score}% match: 0/${requiredSkills.length} skills verified yet. Primary gaps in ${topGaps}.`;
  } else {
    reasoning = `${score}% match: meets all required competencies.`;
  }

  return {
    score,
    matched,
    gaps,
    detailedGaps,
    reasoning,
    evidenceBreakdown: {
      assessmentCount,
      projectCount,
      facultySignoffCount,
      selfReportedCount,
      evidenceWeight,
      verifiedSkillsCount,
    },
    skillOverlap,
  };
};

/**
 * Calculates match between a student and an opportunity, returning populated documents,
 * match score, reasoning, and detailed gap objects for roadmap generation.
 *
 * @param {string} opportunityId
 * @param {string} studentId
 * @returns {Promise<Object>} { studentProfile, opportunity, score, matched, gaps, detailedGaps, reasoning }
 */
export const calculateOpportunityMatch = async (opportunityId, studentId) => {
  const studentProfile = await StudentProfile.findOne({
    $or: [{ user: studentId }, { _id: studentId }],
  }).populate("skills.skill", "name");

  if (!studentProfile) {
    const err = new Error("Student profile not found.");
    err.status = 404;
    throw err;
  }

  const opportunity = await Opportunity.findById(opportunityId).populate(
    "requiredSkills.skill",
    "name"
  );

  if (!opportunity) {
    const err = new Error("Opportunity not found.");
    err.status = 404;
    throw err;
  }

  const normalizedRequired = (opportunity.requiredSkills || []).map((rs) => ({
    skillId: rs.skill?._id || rs.skill,
    skillName: rs.skill?.name || "Unknown",
    minLevel: rs.minLevel !== undefined ? rs.minLevel : 50,
    weight: rs.weight !== undefined ? rs.weight : 1,
  }));

  const matchResult = computeMatch(studentProfile.skills, normalizedRequired);

  // Map student skills by ID
  const studentSkillMap = new Map();
  for (const entry of studentProfile.skills || []) {
    const sId = (entry?.skill?._id || entry?.skill)?.toString();
    if (sId) {
      studentSkillMap.set(sId, entry);
    }
  }

  const detailedGaps = [];
  for (const req of normalizedRequired) {
    const sId = req.skillId?.toString();
    const studentEntry = sId ? studentSkillMap.get(sId) : null;
    const currentLevel = studentEntry && typeof studentEntry.level === "number" ? studentEntry.level : 0;
    const requiredLevel = req.minLevel || 50;

    if (currentLevel < requiredLevel) {
      detailedGaps.push({
        skillName: req.skillName,
        skillId: sId,
        currentLevel,
        requiredLevel,
        gapSize: requiredLevel - currentLevel,
      });
    }
  }

  return {
    studentProfile,
    opportunity,
    score: matchResult.score,
    matched: matchResult.matched,
    gaps: matchResult.gaps,
    detailedGaps: matchResult.detailedGaps || detailedGaps,
    reasoning: matchResult.reasoning,
    evidenceBreakdown: matchResult.evidenceBreakdown,
    skillOverlap: matchResult.skillOverlap,
  };
};
