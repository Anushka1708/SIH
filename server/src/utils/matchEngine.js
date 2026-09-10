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
      reasoning: "100% match: meets all required skills",
    };
  }

  let totalWeight = 0;
  let totalContribution = 0;
  const matched = [];
  const gaps = [];

  // Map studentSkills by skill ObjectId string for quick lookup
  const studentSkillMap = new Map();
  for (const entry of studentSkills) {
    const id = (entry?.skill?._id || entry?.skill)?.toString();
    if (id) {
      studentSkillMap.set(id, entry);
    }
  }

  for (const req of requiredSkills) {
    const skillId = req.skillId?.toString();
    const skillName = req.skillName || "Unknown Skill";
    const minLevel = req.minLevel !== undefined && req.minLevel > 0 ? req.minLevel : 50;
    const weight = req.weight !== undefined && req.weight >= 0 ? req.weight : 1;

    totalWeight += weight;

    const studentEntry = skillId ? studentSkillMap.get(skillId) : null;

    if (studentEntry) {
      const studentLevel = typeof studentEntry.level === "number" ? studentEntry.level : 0;
      const ratio = minLevel > 0 ? studentLevel / minLevel : 1;
      const contribution = weight * Math.min(1, Math.max(0, ratio));
      totalContribution += contribution;

      if (studentLevel >= minLevel) {
        matched.push(skillName);
      } else {
        gaps.push(skillName);
      }
    } else {
      // Not found in student's skills
      gaps.push(skillName);
    }
  }

  const score = totalWeight > 0 ? Math.round((totalContribution / totalWeight) * 100) : 0;

  // Build human-readable reasoning string
  const topMatched = matched.slice(0, 3).join(", ");
  const topGaps = gaps.slice(0, 2).join(", ");

  let reasoning = "";
  if (matched.length > 0 && gaps.length > 0) {
    reasoning = `${score}% match: strong in ${topMatched}, gap in ${topGaps}`;
  } else if (matched.length > 0 && gaps.length === 0) {
    reasoning = `${score}% match: strong in ${topMatched}, meets all required skills`;
  } else if (matched.length === 0 && gaps.length > 0) {
    reasoning = `${score}% match: no matching skills found yet, gap in ${topGaps}`;
  } else {
    reasoning = `${score}% match: meets all required skills`;
  }

  return { score, matched, gaps, reasoning };
};
