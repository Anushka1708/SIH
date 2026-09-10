import express from "express";
import { protect } from "../middleware/auth.js";
import {
  generateSkillQuiz,
  submitSkillQuiz,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Generate 5 dynamic MCQs for a skill
router.post("/generate-quiz", protect, generateSkillQuiz);

// Submit quiz answers, update profile skill vector, and award badge
router.post("/submit-quiz", protect, submitSkillQuiz);

export default router;
