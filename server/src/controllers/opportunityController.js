import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";
import CompanyProfile from "../models/CompanyProfile.js";
import Skill from "../models/Skill.js";

/**
 * POST /api/opportunities
 * Restricted to 'company'. Creates a new opportunity posting.
 */
export const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      requiredSkills,
      location,
      stipend,
      applicationDeadline,
      deadline,
      isRemote,
    } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({ message: "Title, description, and type are required." });
    }

    const validTypes = ["internship", "job", "project"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid type '${type}'. Allowed types are: ${validTypes.join(", ")}.`,
      });
    }

    // Find CompanyProfile for current user
    const companyProfile = await CompanyProfile.findOne({ user: req.user.id });

    const finalDeadline = applicationDeadline || deadline || undefined;

    const opportunity = await Opportunity.create({
      postedBy: req.user.id,
      company: companyProfile ? companyProfile._id : undefined,
      title: title.trim(),
      description: description.trim(),
      type,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      location: location ? location.trim() : undefined,
      stipend: stipend ? String(stipend).trim() : undefined,
      applicationDeadline: finalDeadline,
      deadline: finalDeadline,
      isRemote: Boolean(isRemote),
    });

    await opportunity.populate("company requiredSkills.skill");

    return res.status(201).json({
      success: true,
      opportunity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create opportunity" });
  }
};

/**
 * GET /api/opportunities
 * Supports filtering by type, search (title/description regex), and location.
 */
export const getOpportunities = async (req, res) => {
  try {
    const { type, search, location } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (location) {
      filter.location = { $regex: location.trim(), $options: "i" };
    }

    if (search) {
      const trimmedSearch = search.trim();
      filter.$or = [
        { title: { $regex: trimmedSearch, $options: "i" } },
        { description: { $regex: trimmedSearch, $options: "i" } },
      ];
    }

    const opportunities = await Opportunity.find(filter)
      .populate("company")
      .populate("requiredSkills.skill")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch opportunities" });
  }
};

/**
 * GET /api/opportunities/:id
 * Fetches single opportunity by id with populated company and skills.
 */
export const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const opportunity = await Opportunity.findById(id)
      .populate("company")
      .populate("requiredSkills.skill")
      .populate("postedBy", "name email role");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    return res.status(200).json({
      success: true,
      opportunity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch opportunity" });
  }
};

/**
 * PUT /api/opportunities/:id
 * Restricted to 'company'. Owner-only update of opportunity details.
 */
export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Verify company ownership
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this opportunity" });
    }

    const updatableFields = [
      "title",
      "description",
      "type",
      "requiredSkills",
      "location",
      "isRemote",
      "stipend",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    if (req.body.applicationDeadline !== undefined || req.body.deadline !== undefined) {
      const deadlineVal = req.body.applicationDeadline || req.body.deadline;
      opportunity.applicationDeadline = deadlineVal;
      opportunity.deadline = deadlineVal;
    }

    await opportunity.save();
    await opportunity.populate("company requiredSkills.skill");

    return res.status(200).json({
      success: true,
      opportunity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update opportunity" });
  }
};

/**
 * DELETE /api/opportunities/:id
 * Restricted to 'company'. Owner-only deletion of opportunity.
 */
export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Verify company ownership
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this opportunity" });
    }

    await Opportunity.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete opportunity" });
  }
};

/**
 * POST /api/opportunities/:id/apply
 * Restricted to 'student'. Appends application to applicants array.
 * CRITICAL RULE: Leaves matchScore and matchReasoning untouched for Dev 2's matching engine.
 */
export const applyToOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.status === "closed") {
      return res.status(400).json({ message: "This opportunity is closed for applications." });
    }

    // Check for duplicate application
    const alreadyApplied = opportunity.applicants.some(
      (app) => app.student && app.student.toString() === req.user.id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this opportunity" });
    }

    // Append applicant entry without setting matchScore/matchReasoning
    opportunity.applicants.push({
      student: req.user.id,
      status: "applied",
      appliedAt: new Date(),
    });

    await opportunity.save();

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to submit application" });
  }
};

/**
 * PATCH /api/opportunities/:id/applicants/:studentId
 * Restricted to 'company'. Owner-only applicant status update.
 */
export const updateApplicantStatus = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid opportunity or student ID format." });
    }

    const validStatuses = [
      "applied",
      "reviewing",
      "shortlisted",
      "interview",
      "hired",
      "accepted",
      "rejected",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status '${status}'. Allowed statuses are: ${validStatuses.join(", ")}.`,
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Verify company ownership
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update applicant status for this opportunity",
      });
    }

    // Find the applicant entry
    const applicant = opportunity.applicants.find(
      (app) => app.student && app.student.toString() === studentId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Update status
    applicant.status = status;

    await opportunity.save();
    await opportunity.populate("company requiredSkills.skill");

    return res.status(200).json({
      success: true,
      opportunity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update applicant status" });
  }
};
