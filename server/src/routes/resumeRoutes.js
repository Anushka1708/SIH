import express from "express";
import { protect } from "../middleware/auth.js";
import { parseResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/parse", protect, parseResume);

export default router;
