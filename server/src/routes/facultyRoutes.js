import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getFacultyDashboard,
  getFacultyAssessments,
  createFacultyAssessment,
  updateFacultyAssessment,
  deleteFacultyAssessment,
  evaluateFacultyAssessment,
  getFacultyUpskilling,
  submitUpskillingQuiz,
  uploadAndAnalyzeFacultyCV,
  getFacultyCV,
} from "../controllers/facultyController.js";

const router = express.Router();

// All faculty routes require authentication
router.use(protect);

// Dashboard
router.get("/dashboard", getFacultyDashboard);

// Assessment Management
router.get("/assessments", getFacultyAssessments);
router.post("/assessments", createFacultyAssessment);
router.put("/assessments/:id", updateFacultyAssessment);
router.delete("/assessments/:id", deleteFacultyAssessment);
router.post("/assessments/:id/evaluate", evaluateFacultyAssessment);

// Educator Upskilling & AI Quizzes
router.get("/upskilling", getFacultyUpskilling);
router.post("/upskilling/submit-quiz", submitUpskillingQuiz);

// Faculty AI CV / Academic Resume Analyzer
router.post("/resume/upload", uploadAndAnalyzeFacultyCV);
router.get("/resume", getFacultyCV);

export default router;
