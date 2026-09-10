import express from "express";
import { protect } from "../middleware/auth.js";
import { parseResume, getMyResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/parse", protect, parseResume);
router.get("/my-resume", protect, getMyResume);

export default router;
