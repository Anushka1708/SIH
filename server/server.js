import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SIH26044 server running" });
});

import authRoutes from "./src/routes/authRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import matchingRoutes from "./src/routes/matchingRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import opportunityRoutes from "./src/routes/opportunityRoutes.js";
import roadmapRoutes from "./src/routes/roadmapRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import verificationRoutes from "./src/routes/verificationRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import assessmentRoutes from "./src/routes/assessmentRoutes.js";
import facultyRoutes from "./src/routes/facultyRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/faculty", facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));