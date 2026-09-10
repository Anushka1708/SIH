import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
  updateApplicantStatus,
} from "../controllers/opportunityController.js";

const router = express.Router();

// Public/Protected Opportunity browsing
router.get("/", protect, getOpportunities);
router.get("/:id", protect, getOpportunityById);

// Company Opportunity management
router.post("/", protect, restrictTo("company"), createOpportunity);
router.put("/:id", protect, restrictTo("company"), updateOpportunity);
router.delete("/:id", protect, restrictTo("company"), deleteOpportunity);

// Student application submission
router.post("/:id/apply", protect, restrictTo("student"), applyToOpportunity);

// Company applicant status management
router.patch(
  "/:id/applicants/:studentId",
  protect,
  restrictTo("company"),
  updateApplicantStatus
);

export default router;
