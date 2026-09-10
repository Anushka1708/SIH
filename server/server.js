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
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SIH26044 server running" });
});

import authRoutes from "./src/routes/authRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import opportunityRoutes from "./src/routes/opportunityRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/opportunities", opportunityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
