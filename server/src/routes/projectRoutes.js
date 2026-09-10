import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  assignProject,
  submitMilestone,
  verifyMilestone,
  applyToProject,
  getFacultySupervisedProjects,
  reviewFacultyJointProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/faculty/supervised", protect, getFacultySupervisedProjects);
router.post("/:id/co-guide-rating", protect, reviewFacultyJointProject);
router.get("/:id", getProjectById);
router.post("/:id/apply", applyToProject);
router.patch("/:id/assign", assignProject);
router.patch("/:id/milestones/:milestoneIndex/submit", submitMilestone);
router.patch("/:id/milestones/:milestoneIndex/verify", verifyMilestone);

export default router;
