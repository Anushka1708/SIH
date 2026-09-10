import mongoose from "mongoose";
import LiveProject from "../models/LiveProject.js";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";

/**
 * POST /api/projects
 * Company or faculty creates a new LiveProject with required skills, milestones, and skillsAwarded.
 */
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      postedBy,
      company,
      assignedFaculty,
      assignedStudents,
      requiredSkills,
      milestones,
      skillsAwarded,
      status,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    // Resolve creator ID from req.user or request body
    const creatorId = req.user?.id || postedBy || company;
    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ error: "A valid postedBy / creator User ID is required." });
    }

    // Validate requiredSkills (plain array of Skill ObjectIds)
    if (requiredSkills && Array.isArray(requiredSkills)) {
      for (const sId of requiredSkills) {
        if (!mongoose.Types.ObjectId.isValid(sId)) {
          return res.status(400).json({ error: `Invalid skill ID in requiredSkills: ${sId}` });
        }
      }
    }

    // Validate skillsAwarded ({ skill: ObjectId, level: Number between 0-100 })
    if (skillsAwarded && Array.isArray(skillsAwarded)) {
      for (const item of skillsAwarded) {
        if (!item.skill || !mongoose.Types.ObjectId.isValid(item.skill)) {
          return res.status(400).json({ error: "Each skillsAwarded item must specify a valid skill ObjectId." });
        }
        if (typeof item.level !== "number" || item.level < 0 || item.level > 100) {
          return res.status(400).json({ error: "skillsAwarded level must be a number between 0 and 100." });
        }
      }
    }

    // Prepare milestones with default status: "pending"
    const formattedMilestones = (milestones || []).map((m) => ({
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      status: m.status || "pending",
      studentNotes: m.studentNotes || "",
      facultyFeedback: m.facultyFeedback || "",
    }));

    const project = await LiveProject.create({
      title: title.trim(),
      description: description.trim(),
      postedBy: creatorId,
      assignedFaculty: assignedFaculty || undefined,
      assignedStudents: assignedStudents || [],
      requiredSkills: requiredSkills || [],
      milestones: formattedMilestones,
      skillsAwarded: skillsAwarded || [],
      status: status || (assignedStudents?.length ? "assigned" : "open"),
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("createProject error:", error);
    return res.status(500).json({ error: error.message || "Failed to create live project." });
  }
};

/**
 * GET /api/projects
 * Fetches all live projects with optional query filtering and populated relationships.
 */
export const getAllProjects = async (req, res) => {
  try {
    const { status, company, postedBy, assignedFaculty, student } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (company || postedBy) filter.postedBy = company || postedBy;
    if (assignedFaculty) filter.assignedFaculty = assignedFaculty;
    if (student) filter.assignedStudents = student;

    const projects = await LiveProject.find(filter)
      .populate("requiredSkills", "name category")
      .populate("skillsAwarded.skill", "name category")
      .populate("assignedStudents", "name email")
      .populate("assignedFaculty", "name email")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({ count: projects.length, projects });
  } catch (error) {
    console.error("getAllProjects error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch live projects." });
  }
};

/**
 * GET /api/projects/:id
 * Fetches single live project with full population.
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format." });
    }

    const project = await LiveProject.findById(id)
      .populate("requiredSkills", "name category")
      .populate("skillsAwarded.skill", "name category")
      .populate("assignedStudents", "name email")
      .populate("assignedFaculty", "name email")
      .populate("postedBy", "name email")
      .populate("milestones.verifiedBy", "name email");

    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    return res.json(project);
  } catch (error) {
    console.error("getProjectById error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch project details." });
  }
};

/**
 * PATCH /api/projects/:id/assign
 * Assigns faculty mentor and/or student roster to a project.
 * Validates that students exist in StudentProfile.
 */
export const assignProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedFaculty, assignedStudents } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format." });
    }

    const project = await LiveProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    if (assignedFaculty !== undefined) {
      if (assignedFaculty && !mongoose.Types.ObjectId.isValid(assignedFaculty)) {
        return res.status(400).json({ error: "Invalid assignedFaculty ID format." });
      }
      project.assignedFaculty = assignedFaculty || undefined;
    }

    if (assignedStudents !== undefined && Array.isArray(assignedStudents)) {
      const resolvedStudentUserIds = [];

      for (const sId of assignedStudents) {
        if (!mongoose.Types.ObjectId.isValid(sId)) {
          return res.status(400).json({ error: `Invalid student ID format: ${sId}` });
        }

        // Validate student exists in StudentProfile
        const profile = await StudentProfile.findOne({
          $or: [{ user: sId }, { _id: sId }],
        });

        if (!profile) {
          return res.status(404).json({ error: `Student profile not found for ID: ${sId}` });
        }

        resolvedStudentUserIds.push(profile.user);
      }

      project.assignedStudents = resolvedStudentUserIds;
    }

    if (project.status === "open" && (project.assignedFaculty || project.assignedStudents?.length)) {
      project.status = "assigned";
    }

    await project.save();

    const updated = await LiveProject.findById(id)
      .populate("assignedStudents", "name email")
      .populate("assignedFaculty", "name email");

    return res.json({ success: true, project: updated });
  } catch (error) {
    console.error("assignProject error:", error);
    return res.status(500).json({ error: error.message || "Failed to assign project." });
  }
};

/**
 * PATCH /api/projects/:id/milestones/:milestoneIndex/submit
 * Student submits work notes for a milestone, transitioning status to 'submitted'.
 */
export const submitMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { studentNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format." });
    }

    const project = await LiveProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    // Milestone can be identified by index (0, 1, 2...) or subdocument _id
    let milestone = null;
    if (/^\d+$/.test(milestoneIndex)) {
      const idx = parseInt(milestoneIndex, 10);
      milestone = project.milestones[idx];
    } else if (mongoose.Types.ObjectId.isValid(milestoneIndex)) {
      milestone = project.milestones.id(milestoneIndex);
    }

    if (!milestone) {
      return res.status(404).json({ error: `Milestone '${milestoneIndex}' not found.` });
    }

    if (studentNotes !== undefined) {
      milestone.studentNotes = studentNotes;
    }

    milestone.status = "submitted";

    if (project.status === "assigned" || project.status === "open") {
      project.status = "in-progress";
    }

    await project.save();

    return res.json({
      success: true,
      message: "Milestone submitted successfully.",
      milestone,
      project,
    });
  } catch (error) {
    console.error("submitMilestone error:", error);
    return res.status(500).json({ error: error.message || "Failed to submit milestone." });
  }
};

/**
 * PATCH /api/projects/:id/milestones/:milestoneIndex/verify
 * Faculty verifies milestone ('completed' or 'in-progress').
 * Closed-loop USP: When ALL milestones are completed, project marks completed and
 * awarded skills are automatically upserted into each assigned student's StudentProfile.
 */
export const verifyMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { facultyFeedback, status = "completed", verifiedBy: explicitVerifier } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format." });
    }

    const verifierId = req.user?.id || explicitVerifier;
    if (verifierId && !mongoose.Types.ObjectId.isValid(verifierId)) {
      return res.status(400).json({ error: "Invalid verifier User ID format." });
    }

    const project = await LiveProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    let milestone = null;
    if (/^\d+$/.test(milestoneIndex)) {
      const idx = parseInt(milestoneIndex, 10);
      milestone = project.milestones[idx];
    } else if (mongoose.Types.ObjectId.isValid(milestoneIndex)) {
      milestone = project.milestones.id(milestoneIndex);
    }

    if (!milestone) {
      return res.status(404).json({ error: `Milestone '${milestoneIndex}' not found.` });
    }

    const validStatuses = ["completed", "in-progress"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    milestone.status = status;
    if (facultyFeedback !== undefined) {
      milestone.facultyFeedback = facultyFeedback;
    }

    if (status === "completed") {
      milestone.verifiedBy = verifierId || project.assignedFaculty;
      milestone.verifiedAt = new Date();
    }

    // Check if ALL milestones are now marked completed
    const allMilestonesCompleted =
      project.milestones.length > 0 &&
      project.milestones.every((m) => m.status === "completed");

    let updatedStudentsCount = 0;

    if (allMilestonesCompleted) {
      project.status = "completed";

      // Closed-loop skill upgrade for each assigned student
      for (const studentUserId of project.assignedStudents) {
        const studentProfile = await StudentProfile.findOne({
          $or: [{ user: studentUserId }, { _id: studentUserId }],
        });

        if (!studentProfile) continue;

        let profileModified = false;

        for (const award of project.skillsAwarded || []) {
          const awardSkillId = (award.skill?._id || award.skill)?.toString();
          if (!awardSkillId) continue;

          // Check if student.skills already contains this skill (match by skill ObjectId)
          const existingSkillEntry = studentProfile.skills.find((s) => {
            const sId = (s.skill?._id || s.skill)?.toString();
            return sId === awardSkillId;
          });

          if (existingSkillEntry) {
            // Upgrade level to maximum, set verified & project evidence
            existingSkillEntry.level = Math.max(existingSkillEntry.level || 0, award.level);
            existingSkillEntry.verified = true;
            existingSkillEntry.evidenceType = "project";
            existingSkillEntry.evidenceRef = project._id.toString();
            existingSkillEntry.verifiedBy = verifierId || project.assignedFaculty;
            existingSkillEntry.verifiedAt = new Date();
            profileModified = true;
          } else {
            // Push new project-verified skill entry
            studentProfile.skills.push({
              skill: award.skill,
              level: award.level,
              verified: true,
              evidenceType: "project",
              evidenceRef: project._id.toString(),
              verifiedBy: verifierId || project.assignedFaculty,
              verifiedAt: new Date(),
            });
            profileModified = true;
          }
        }

        if (profileModified) {
          await studentProfile.save();
          updatedStudentsCount++;
        }
      }
    }

    await project.save();

    return res.json({
      success: true,
      project,
      allMilestonesCompleted,
      updatedStudentsCount,
    });
  } catch (error) {
    console.error("verifyMilestone error:", error);
    return res.status(500).json({ error: error.message || "Failed to verify milestone." });
  }
};

/**
 * POST /api/projects/:id/apply
 * Student bids / applies to work on a LiveProject.
 */
export const applyToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const studentUserId = req.user?.id || req.body.studentId;

    if (!mongoose.Types.ObjectId.isValid(id) || !studentUserId || !mongoose.Types.ObjectId.isValid(studentUserId)) {
      return res.status(400).json({ error: "Invalid project ID or student ID format." });
    }

    const project = await LiveProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Live project not found." });
    }

    const studentProfile = await StudentProfile.findOne({
      $or: [{ user: studentUserId }, { _id: studentUserId }],
    });

    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const resolvedUserId = studentProfile.user;

    const alreadyApplied = (project.assignedStudents || []).some(
      (s) => s.toString() === resolvedUserId.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ error: "Already applied or assigned to this project." });
    }

    project.assignedStudents = project.assignedStudents || [];
    project.assignedStudents.push(resolvedUserId);
    if (project.status === "open") {
      project.status = "assigned";
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Applied to live project successfully!",
      project,
    });
  } catch (error) {
    console.error("applyToProject error:", error);
    return res.status(500).json({ error: error.message || "Failed to apply to project." });
  }
};

