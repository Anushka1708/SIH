import express from "express";
import {
  generateRoadmap,
  getStudentRoadmap,
  updateRoadmapItemStatus,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", generateRoadmap);
router.get("/student/:studentId", getStudentRoadmap);
router.patch("/student/:studentId/item/:itemId", updateRoadmapItemStatus);

export default router;
