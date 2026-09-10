import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  assignProject,
  submitMilestone,
  verifyMilestone,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.patch("/:id/assign", assignProject);
router.patch("/:id/milestones/:milestoneIndex/submit", submitMilestone);
router.patch("/:id/milestones/:milestoneIndex/verify", verifyMilestone);

export default router;
