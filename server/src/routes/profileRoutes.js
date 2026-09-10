import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getProfileMe,
  updateProfileMe,
  getProfileById,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", protect, getProfileMe);
router.put("/me", protect, updateProfileMe);
router.get("/:id", protect, getProfileById);

export default router;
