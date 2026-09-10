import express from "express";
import {
  matchStudentToOpportunity,
  matchStudentToProject,
  searchTalent,
} from "../controllers/matchingController.js";

const router = express.Router();

router.get("/opportunity/:opportunityId/student/:studentId", matchStudentToOpportunity);
router.get("/project/:projectId/student/:studentId", matchStudentToProject);
router.get("/talent-search", searchTalent);

export default router;

