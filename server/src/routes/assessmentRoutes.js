import express from "express";
import { protect } from "../middleware/auth.js";
import {
  generateSkillQuiz,
  submitSkillQuiz,
  generateDiagnosticQuiz,
  submitDiagnosticQuiz,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Generate 5 dynamic MCQs for a skill
router.post("/generate-quiz", protect, generateSkillQuiz);

// Submit quiz answers, update profile skill vector, and award badge
router.post("/submit-quiz", protect, submitSkillQuiz);

// Initial Diagnostic Assessment (15 comprehensive questions on resume skills)
router.post("/generate-diagnostic", protect, generateDiagnosticQuiz);
router.post("/submit-diagnostic", protect, submitDiagnosticQuiz);

export default router;
