import mongoose from "mongoose";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import FacultyProfile from "../models/FacultyProfile.js";
import InstitutionProfile from "../models/InstitutionProfile.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";

/**
 * GET /api/profile/me
 * Protected endpoint returning the current user's role-specific profile document.
 */
export const getProfileMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    let profile = null;

    switch (role) {
      case "student":
        profile = await StudentProfile.findOne({ user: id }).populate("skills.skill targetRoles");
        break;
      case "company":
        profile = await CompanyProfile.findOne({ user: id });
        break;
      case "faculty":
        profile = await FacultyProfile.findOne({ user: id }).populate("expertiseSkills institution");
        break;
      case "institution":
        profile = await InstitutionProfile.findOne({ user: id });
        break;
      default:
        return res.status(400).json({ message: `Invalid user role: ${role}` });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      role,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to retrieve profile" });
  }
};

/**
 * PUT /api/profile/me
 * Protected endpoint updating the current user's role-specific profile document.
 * Safely merges skill arrays for students without overwriting verified states.
 */
export const updateProfileMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    let profile = null;

    switch (role) {
      case "student":
        profile = await StudentProfile.findOne({ user: id });
        break;
      case "company":
        profile = await CompanyProfile.findOne({ user: id });
        break;
      case "faculty":
        profile = await FacultyProfile.findOne({ user: id });
        break;
      case "institution":
        profile = await InstitutionProfile.findOne({ user: id });
        break;
      default:
        return res.status(400).json({ message: `Invalid user role: ${role}` });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (role === "student") {
      // Direct student fields to update if provided
      const directFields = [
        "bio",
        "contactNumber",
        "portfolio",
        "resumeUrl",
        "resumeFileName",
        "degree",
        "branch",
        "college",
        "targetRoles",
      ];

      directFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          profile[field] = req.body[field];
        }
      });

      // Handle year update with string or number parsing
      if (req.body.year !== undefined && req.body.year !== null) {
        const match = String(req.body.year).match(/\d+/);
        if (match) {
          const digit = parseInt(match[0], 10);
          if (!isNaN(digit) && digit >= 1 && digit <= 6) {
            profile.year = digit;
          }
        }
      }

      // CRITICAL ARRAY SAFETY RULE FOR SKILLS:
      // If req.body.skills array is provided, MERGE entries by skill ObjectId.
      // Do NOT overwrite profile.skills. For existing skill IDs, update non-destructive
      // fields (level, evidenceRef, evidenceType) while preserving existing verified,
      // verifiedBy, and verifiedAt. Push new skill ObjectIds if not already present.
      if (Array.isArray(req.body.skills)) {
        for (const item of req.body.skills) {
          if (!item || !item.skill) continue;

          // Normalize skill ObjectId string
          const incomingSkillId =
            item.skill._id !== undefined ? String(item.skill._id) : String(item.skill);

          const existingIndex = profile.skills.findIndex((s) => {
            const existingId = s.skill?._id !== undefined ? String(s.skill._id) : String(s.skill);
            return existingId === incomingSkillId;
          });

          if (existingIndex > -1) {
            // Update non-destructive fields while strictly preserving verification metadata
            const existingEntry = profile.skills[existingIndex];
            if (item.level !== undefined) existingEntry.level = item.level;
            if (item.evidenceRef !== undefined) existingEntry.evidenceRef = item.evidenceRef;
            if (item.evidenceType !== undefined) existingEntry.evidenceType = item.evidenceType;
          } else {
            // Push new skill entry with default unverified state
            profile.skills.push({
              skill: incomingSkillId,
              level: item.level !== undefined ? item.level : 0,
              verified: false,
              evidenceType: item.evidenceType || "self-reported",
              evidenceRef: item.evidenceRef || undefined,
            });
          }
        }
      }
    } else {
      // For 'company', 'faculty', 'institution':
      // Perform direct non-destructive object updates on incoming fields
      const protectedFields = ["_id", "user", "createdAt", "updatedAt", "__v"];
      Object.keys(req.body).forEach((key) => {
        if (!protectedFields.includes(key) && req.body[key] !== undefined) {
          profile[key] = req.body[key];
        }
      });
    }

    await profile.save();

    // Populate skill details for student response
    if (role === "student") {
      await profile.populate("skills.skill targetRoles");
    } else if (role === "faculty") {
      await profile.populate("expertiseSkills institution");
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

/**
 * GET /api/profile/:id
 * Protected endpoint returning any profile by either profile _id or user _id.
 */
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const query = { $or: [{ _id: id }, { user: id }] };

    // Search sequentially across all profile collections
    let profile = await StudentProfile.findOne(query)
      .populate("skills.skill targetRoles")
      .populate("user", "name email role");

    if (!profile) {
      profile = await CompanyProfile.findOne(query).populate("user", "name email role");
    }

    if (!profile) {
      profile = await FacultyProfile.findOne(query)
        .populate("expertiseSkills institution")
        .populate("user", "name email role");
    }

    if (!profile) {
      profile = await InstitutionProfile.findOne(query).populate("user", "name email role");
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to retrieve profile" });
  }
};
