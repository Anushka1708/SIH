import express from "express";
import {
  evaluateSkillAssessment,
  evaluateMilestoneAI,
} from "../controllers/verificationController.js";

const router = express.Router();

router.post("/ai-evaluate", evaluateSkillAssessment);
router.post("/milestone-ai-evaluate", evaluateMilestoneAI);

export default router;
