import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import assert from "node:assert/strict";

// Configure DNS and environment
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import opportunityRoutes from "./src/routes/opportunityRoutes.js";

// Import models for cleanup & direct verification
import User from "./src/models/User.js";
import StudentProfile from "./src/models/StudentProfile.js";
import CompanyProfile from "./src/models/CompanyProfile.js";
import Opportunity from "./src/models/Opportunity.js";
import Skill from "./src/models/Skill.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/opportunities", opportunityRoutes);

const runTest = async () => {
  console.log("=================================================");
  console.log("   SIH26044 Dev 1 End-to-End Automated Test Suite");
  console.log("=================================================\n");

  console.log("⏳ [1/10] Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected successfully.\n");

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`🌐 Test server listening on ${baseUrl}\n`);

  const timestamp = Date.now();
  const studentEmail = `student_${timestamp}@test.com`;
  const companyEmail = `company_${timestamp}@test.com`;
  const password = "Password123!";

  let studentToken = null;
  let studentUser = null;
  let companyToken = null;
  let companyUser = null;
  let testSkill1 = null;
  let testSkill2 = null;
  let createdOpportunityId = null;

  try {
    // -------------------------------------------------------------
    // Test 1: Seed Test Skills
    // -------------------------------------------------------------
    console.log("⏳ [2/10] Seeding Test Skills...");
    testSkill1 = await Skill.findOneAndUpdate(
      { name: `React_${timestamp}` },
      {
        name: `React_${timestamp}`,
        category: "technical",
        aliases: ["ReactJS"],
      },
      { upsert: true, new: true }
    );

    testSkill2 = await Skill.findOneAndUpdate(
      { name: `Node_${timestamp}` },
      {
        name: `Node_${timestamp}`,
        category: "technical",
        aliases: ["Node.js"],
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Skills seeded: ${testSkill1.name} & ${testSkill2.name}\n`);

    // -------------------------------------------------------------
    // Test 2: Student & Company Signup
    // -------------------------------------------------------------
    console.log("⏳ [3/10] Testing Student & Company Signup...");
    
    // Student Signup
    const studentSignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dev1 Test Student",
        email: studentEmail,
        password,
        role: "student",
        college: "National Institute of Technology",
        degree: "B.Tech",
        branch: "Computer Science",
        year: 3,
        targetRoles: ["Fullstack Engineer", "Frontend Developer"],
      }),
    });
    const studentSignupData = await studentSignupRes.json();
    assert.equal(studentSignupRes.status, 201, `Student signup failed: ${JSON.stringify(studentSignupData)}`);
    assert.ok(studentSignupData.token, "Student token should exist");
    assert.equal(studentSignupData.user.role, "student");
    studentToken = studentSignupData.token;
    studentUser = studentSignupData.user;
    console.log("   - Student signup passed.");

    // Company Signup
    const companySignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dev1 Test Company Admin",
        email: companyEmail,
        password,
        role: "company",
        companyName: "Nexus AI Technologies",
        industry: "Information Technology",
        location: "Bangalore",
        about: "Leading AI solutions provider.",
      }),
    });
    const companySignupData = await companySignupRes.json();
    assert.equal(companySignupRes.status, 201, `Company signup failed: ${JSON.stringify(companySignupData)}`);
    assert.ok(companySignupData.token, "Company token should exist");
    assert.equal(companySignupData.user.role, "company");
    companyToken = companySignupData.token;
    companyUser = companySignupData.user;
    console.log("   - Company signup passed.");
    console.log("✅ Multi-Role Signup complete.\n");

    // -------------------------------------------------------------
    // Test 3: Login Authentication
    // -------------------------------------------------------------
    console.log("⏳ [4/10] Testing Login Authentication...");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password,
      }),
    });
    const loginData = await loginRes.json();
    assert.equal(loginRes.status, 200, "Student login failed");
    assert.ok(loginData.token, "Token returned on login");
    console.log("✅ Login flow verified.\n");

    // -------------------------------------------------------------
    // Test 4: Profile GET /api/profile/me
    // -------------------------------------------------------------
    console.log("⏳ [5/10] Testing Profile GET /api/profile/me...");
    const getProfileRes = await fetch(`${baseUrl}/api/profile/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const getProfileData = await getProfileRes.json();
    assert.equal(getProfileRes.status, 200, "GET profile failed");
    assert.equal(getProfileData.role, "student");
    assert.equal(getProfileData.profile.college, "National Institute of Technology");
    console.log("✅ Role-specific profile fetch verified.\n");

    // -------------------------------------------------------------
    // Test 5: Profile Update & Critical Skill Merging
    // -------------------------------------------------------------
    console.log("⏳ [6/10] Testing Profile PUT /api/profile/me (Skill Merging & Verification Preservation)...");
    
    // 1. Manually add an existing verified skill to student profile in DB
    await StudentProfile.findOneAndUpdate(
      { user: studentUser.id },
      {
        $push: {
          skills: {
            skill: testSkill1._id,
            level: 40,
            verified: true,
            evidenceType: "assessment",
            evidenceRef: "assessment-cert-999",
            verifiedAt: new Date("2026-01-15"),
          },
        },
      }
    );

    // 2. Perform PUT /api/profile/me to update:
    //    - Modify testSkill1: level raised to 85, new evidenceRef. (verified MUST remain true)
    //    - Add testSkill2: level 60 (new unverified skill)
    //    - Update bio & contactNumber
    const updateProfileRes = await fetch(`${baseUrl}/api/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: "Aspiring full-stack developer with React & Node expertise.",
        contactNumber: "+91 9876543210",
        skills: [
          {
            skill: testSkill1._id,
            level: 85,
            evidenceRef: "assessment-cert-999-v2",
          },
          {
            skill: testSkill2._id,
            level: 60,
            evidenceType: "self-reported",
          },
        ],
      }),
    });
    const updateProfileData = await updateProfileRes.json();
    assert.equal(updateProfileRes.status, 200, `Profile update failed: ${JSON.stringify(updateProfileData)}`);

    const updatedSkills = updateProfileData.profile.skills;
    assert.equal(updatedSkills.length, 2, "Profile should contain exactly 2 skills");

    const mergedSkill1 = updatedSkills.find(
      (s) => (s.skill?._id || s.skill).toString() === testSkill1._id.toString()
    );
    assert.ok(mergedSkill1, "Skill 1 must exist");
    assert.equal(mergedSkill1.level, 85, "Skill 1 level should be updated to 85");
    assert.equal(mergedSkill1.verified, true, "CRITICAL: Skill 1 verified=true MUST be preserved");
    assert.equal(mergedSkill1.evidenceRef, "assessment-cert-999-v2", "evidenceRef should update");

    const mergedSkill2 = updatedSkills.find(
      (s) => (s.skill?._id || s.skill).toString() === testSkill2._id.toString()
    );
    assert.ok(mergedSkill2, "Skill 2 must be appended");
    assert.equal(mergedSkill2.level, 60, "Skill 2 level should be 60");
    assert.equal(mergedSkill2.verified, false, "Skill 2 verified should default to false");

    assert.equal(updateProfileData.profile.contactNumber, "+91 9876543210");
    console.log("✅ Array safety & non-destructive skill merge strictly verified.\n");

    // -------------------------------------------------------------
    // Test 6: Create Opportunity as Company
    // -------------------------------------------------------------
    console.log("⏳ [7/10] Testing Create Opportunity (POST /api/opportunities)...");
    const createOppRes = await fetch(`${baseUrl}/api/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${companyToken}`,
      },
      body: JSON.stringify({
        title: "Frontend Engineering Intern",
        description: "Work on scalable React web interfaces and micro-frontends.",
        type: "internship",
        location: "Bangalore",
        stipend: "₹30,000/month",
        applicationDeadline: "2026-10-30",
        requiredSkills: [
          { skill: testSkill1._id, minLevel: 70, weight: 1.0 },
          { skill: testSkill2._id, minLevel: 50, weight: 0.7 },
        ],
      }),
    });
    const createOppData = await createOppRes.json();
    assert.equal(createOppRes.status, 201, `Create opportunity failed: ${JSON.stringify(createOppData)}`);
    assert.ok(createOppData.opportunity._id, "Opportunity ID must exist");
    assert.ok(createOppData.opportunity.company, "Company reference must be attached");
    createdOpportunityId = createOppData.opportunity._id;
    console.log(`✅ Opportunity created successfully (ID: ${createdOpportunityId}).\n`);

    // -------------------------------------------------------------
    // Test 7: Get and Filter Opportunities
    // -------------------------------------------------------------
    console.log("⏳ [8/10] Testing Get and Filter Opportunities...");
    const filterRes = await fetch(
      `${baseUrl}/api/opportunities?type=internship&location=Bangalore&search=Frontend`,
      {
        headers: { Authorization: `Bearer ${studentToken}` },
      }
    );
    const filterData = await filterRes.json();
    assert.equal(filterRes.status, 200, "Get filtered opportunities failed");
    assert.ok(filterData.count >= 1, "Should find at least 1 matching opportunity");

    const singleOppRes = await fetch(`${baseUrl}/api/opportunities/${createdOpportunityId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const singleOppData = await singleOppRes.json();
    assert.equal(singleOppRes.status, 200, "Get single opportunity failed");
    assert.equal(singleOppData.opportunity.title, "Frontend Engineering Intern");
    console.log("✅ Opportunity querying, filtering, and detail population verified.\n");

    // -------------------------------------------------------------
    // Test 8: Apply to Opportunity & Duplicate Guard
    // -------------------------------------------------------------
    console.log("⏳ [9/10] Testing Apply to Opportunity & Duplicate Prevention...");
    
    // First apply
    const applyRes = await fetch(`${baseUrl}/api/opportunities/${createdOpportunityId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const applyData = await applyRes.json();
    assert.equal(applyRes.status, 200, `Application failed: ${JSON.stringify(applyData)}`);
    assert.equal(applyData.message, "Application submitted successfully");

    // Duplicate apply attempt
    const dupApplyRes = await fetch(`${baseUrl}/api/opportunities/${createdOpportunityId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const dupApplyData = await dupApplyRes.json();
    assert.equal(dupApplyRes.status, 400, "Duplicate apply must return 400");
    assert.equal(dupApplyData.message, "Already applied to this opportunity");

    // Check application doc directly in DB
    const oppInDb = await Opportunity.findById(createdOpportunityId);
    assert.equal(oppInDb.applicants.length, 1);
    const appRecord = oppInDb.applicants[0];
    assert.equal(appRecord.student.toString(), studentUser.id.toString());
    assert.equal(appRecord.status, "applied");
    // Verify Dev 2 isolation: matchScore & matchReasoning must not be overwritten
    assert.equal(appRecord.matchScore, undefined, "matchScore must be empty for Dev 2");
    assert.equal(appRecord.matchReasoning, undefined, "matchReasoning must be empty for Dev 2");
    console.log("✅ Student application, duplicate prevention, and Dev 2 contract verified.\n");

    // -------------------------------------------------------------
    // Test 9: Update Applicant Status & Role Access Control
    // -------------------------------------------------------------
    console.log("⏳ [10/10] Testing Applicant Status Update & Access Controls...");
    
    // Company updates applicant status to "shortlisted"
    const updateStatusRes = await fetch(
      `${baseUrl}/api/opportunities/${createdOpportunityId}/applicants/${studentUser.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({ status: "shortlisted" }),
      }
    );
    const updateStatusData = await updateStatusRes.json();
    assert.equal(updateStatusRes.status, 200, `Update status failed: ${JSON.stringify(updateStatusData)}`);
    const applicantInUpdated = updateStatusData.opportunity.applicants.find(
      (a) => (a.student?._id || a.student).toString() === studentUser.id.toString()
    );
    assert.equal(applicantInUpdated.status, "shortlisted");

    // Unauthorized check: Student trying to post an opportunity
    const unauthorizedPostRes = await fetch(`${baseUrl}/api/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: "Malicious Job",
        description: "Should fail",
        type: "job",
      }),
    });
    assert.equal(unauthorizedPostRes.status, 403, "Student should receive 403 when creating opportunity");

    console.log("✅ Applicant status update & RBAC security verified.\n");

    console.log("=================================================");
    console.log("🎉 ALL DEV 1 FLOW ASSERTIONS PASSED WITH 100% SUCCESS!");
    console.log("=================================================\n");
  } finally {
    console.log("🧹 Cleaning up test fixtures from DB...");
    if (studentUser) {
      await User.findByIdAndDelete(studentUser.id);
      await StudentProfile.deleteOne({ user: studentUser.id });
    }
    if (companyUser) {
      await User.findByIdAndDelete(companyUser.id);
      await CompanyProfile.deleteOne({ user: companyUser.id });
    }
    if (createdOpportunityId) {
      await Opportunity.findByIdAndDelete(createdOpportunityId);
    }
    if (testSkill1) {
      await Skill.findByIdAndDelete(testSkill1._id);
    }
    if (testSkill2) {
      await Skill.findByIdAndDelete(testSkill2._id);
    }
    server.close();
    await mongoose.disconnect();
    console.log("✅ Cleanup complete and connections closed.");
  }
};

runTest().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err);
  process.exit(1);
});
