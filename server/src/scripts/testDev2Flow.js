import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Skill from "../models/Skill.js";
import LiveProject from "../models/LiveProject.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const API_BASE = "http://localhost:5000/api";

const runVerification = async () => {
  console.log("\n========================================================");
  console.log("   DEV 2: LIVE PROJECT PIPELINE & SKILL UPGRADE TEST    ");
  console.log("========================================================\n");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in environment.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB Atlas.");

  // 1. Fetch real student profile and real skill
  const studentProfile = await StudentProfile.findOne().populate("user");
  if (!studentProfile) {
    throw new Error("No StudentProfile found. Please ensure seed/test student exists.");
  }
  const studentUser = studentProfile.user;
  console.log(`Student target: ${studentUser?.name || "Student"} (User ID: ${studentUser?._id}, Profile ID: ${studentProfile._id})`);

  // Select a skill for awarding (e.g., Docker)
  let awardSkill = await Skill.findOne({ name: "Docker" });
  if (!awardSkill) {
    awardSkill = await Skill.findOne();
  }
  console.log(`Award skill: ${awardSkill.name} (Skill ID: ${awardSkill._id})`);

  // Find creator (company) and mentor (faculty)
  let companyUser = await User.findOne({ role: "company" });
  if (!companyUser) {
    companyUser = await User.findOne();
  }
  let facultyUser = await User.findOne({ role: "faculty" });
  if (!facultyUser) {
    facultyUser = companyUser;
  }

  console.log(`Initial student skills count: ${studentProfile.skills.length}`);

  // 2. Create test LiveProject with 1 milestone and skillsAwarded: [{ skill: awardSkill._id, level: 85 }]
  console.log("\n[Step 1] Creating LiveProject with skillsAwarded via POST /api/projects...");
  const createRes = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `Test Project: Cloud & Containerization (${Date.now()})`,
      description: "End-to-end containerized microservices implementation for verification test.",
      postedBy: companyUser._id,
      assignedFaculty: facultyUser._id,
      requiredSkills: [awardSkill._id],
      skillsAwarded: [{ skill: awardSkill._id, level: 85 }],
      milestones: [
        {
          title: "Milestone 1: Complete Container Architecture",
          description: "Build and test container deployment.",
        },
      ],
    }),
  });

  const project = await createRes.json();
  if (!createRes.ok || !project._id) {
    throw new Error(`Failed to create project: ${JSON.stringify(project)}`);
  }
  console.log(`  ✓ Project created successfully (ID: ${project._id}, Status: ${project.status})`);

  // 3. Assign student
  console.log("\n[Step 2] Assigning student via PATCH /api/projects/:id/assign...");
  const assignRes = await fetch(`${API_BASE}/projects/${project._id}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignedStudents: [studentUser._id],
    }),
  });
  const assignData = await assignRes.json();
  console.log(`  ✓ Student assigned. Project status: ${assignData.project?.status}`);

  // 4. Student submits milestone
  console.log("\n[Step 3] Submitting milestone work via PATCH /api/projects/:id/milestones/0/submit...");
  const submitRes = await fetch(`${API_BASE}/projects/${project._id}/milestones/0/submit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentNotes: "Completed container setup, Dockerfiles written and passed CI check.",
    }),
  });
  const submitData = await submitRes.json();
  console.log(`  ✓ Milestone submitted. Status: ${submitData.milestone?.status}`);

  // 5. Faculty verifies final milestone -> triggers closed loop
  console.log("\n[Step 4] Faculty verifying milestone via PATCH /api/projects/:id/milestones/0/verify...");
  const verifyRes = await fetch(`${API_BASE}/projects/${project._id}/milestones/0/verify`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "completed",
      facultyFeedback: "Excellent implementation, all criteria verified.",
      verifiedBy: facultyUser._id,
    }),
  });
  const verifyData = await verifyRes.json();
  console.log(`  ✓ Milestone verified. allMilestonesCompleted: ${verifyData.allMilestonesCompleted}`);
  console.log(`  ✓ Updated students count: ${verifyData.updatedStudentsCount}`);

  // 6. Assertions directly on database document
  console.log("\n[Step 5] Checking StudentProfile directly in MongoDB...");
  const updatedStudentProfile = await StudentProfile.findById(studentProfile._id).populate("skills.skill");

  const awardedEntry = updatedStudentProfile.skills.find(
    (s) => (s.skill?._id || s.skill)?.toString() === awardSkill._id.toString()
  );

  const assertions = [
    {
      Criteria: "Skill present in StudentProfile.skills[]",
      Result: !!awardedEntry ? "PASS" : "FAIL",
      Detail: awardedEntry ? `Found '${awardedEntry.skill?.name || awardSkill.name}'` : "Not found",
    },
    {
      Criteria: "verified === true",
      Result: awardedEntry?.verified === true ? "PASS" : "FAIL",
      Detail: `verified = ${awardedEntry?.verified}`,
    },
    {
      Criteria: "evidenceType === 'project'",
      Result: awardedEntry?.evidenceType === "project" ? "PASS" : "FAIL",
      Detail: `evidenceType = '${awardedEntry?.evidenceType}'`,
    },
    {
      Criteria: "evidenceRef === project._id",
      Result: awardedEntry?.evidenceRef === project._id.toString() ? "PASS" : "FAIL",
      Detail: `evidenceRef = '${awardedEntry?.evidenceRef}'`,
    },
    {
      Criteria: "level >= 85",
      Result: (awardedEntry?.level || 0) >= 85 ? "PASS" : "FAIL",
      Detail: `level = ${awardedEntry?.level}`,
    },
    {
      Criteria: "Project status === 'completed'",
      Result: verifyData.project?.status === "completed" ? "PASS" : "FAIL",
      Detail: `status = '${verifyData.project?.status}'`,
    },
  ];

  console.log("\n--- ASSERTION RESULTS ---");
  console.table(assertions);

  const allPassed = assertions.every((a) => a.Result === "PASS");

  // 7. Cleanup test project
  await LiveProject.findByIdAndDelete(project._id);
  console.log(`Cleaned up temporary test project (${project._id}) from DB.`);

  await mongoose.disconnect();

  if (!allPassed) {
    console.error("\n❌ One or more assertions failed.");
    process.exit(1);
  }

  console.log("\n✅ ALL CHECKS PASSED: Closed-loop live project pipeline successfully upgraded student's verified skills!\n");
  process.exit(0);
};

runVerification().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
