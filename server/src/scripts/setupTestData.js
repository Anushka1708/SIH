import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Opportunity from "../models/Opportunity.js";
import Skill from "../models/Skill.js";

dotenv.config();

const setupTestDocuments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for test data setup.");

    // Check if test student already exists
    let studentUser = await User.findOne({ email: "aarav.patel@example.com" });
    if (!studentUser) {
      studentUser = await User.create({
        name: "Aarav Patel",
        email: "aarav.patel@example.com",
        password: "password123",
        role: "student",
      });
      console.log("Created student User:", studentUser._id.toString());
    }

    // Find skills
    const reactSkill = await Skill.findOne({ name: "React" });
    const nodeSkill = await Skill.findOne({ name: "Node.js" });
    const jsSkill = await Skill.findOne({ name: "JavaScript" });
    const sysDesignSkill = await Skill.findOne({ name: "System Design" });

    if (!reactSkill || !nodeSkill || !jsSkill || !sysDesignSkill) {
      throw new Error("Required skills not found in Skill collection. Please seed skills first.");
    }

    // Check or create StudentProfile
    let studentProfile = await StudentProfile.findOne({ user: studentUser._id });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        user: studentUser._id,
        college: "Indian Institute of Technology",
        degree: "B.Tech",
        branch: "Computer Science",
        year: 3,
        skills: [
          {
            skill: reactSkill._id,
            level: 80,
            verified: true,
            evidenceType: "assessment",
          },
          {
            skill: jsSkill._id,
            level: 75,
            verified: true,
            evidenceType: "certificate",
          },
          {
            skill: nodeSkill._id,
            level: 40,
            verified: false,
            evidenceType: "self-reported",
          },
        ],
        targetRoles: ["Full Stack Developer"],
      });
      console.log("Created StudentProfile:", studentProfile._id.toString());
    }

    // Check or create Company User
    let companyUser = await User.findOne({ email: "contact@techcorp.io" });
    if (!companyUser) {
      companyUser = await User.create({
        name: "TechCorp Labs",
        email: "contact@techcorp.io",
        password: "password123",
        role: "company",
      });
      console.log("Created company User:", companyUser._id.toString());
    }

    // Check or create Opportunity
    let opportunity = await Opportunity.findOne({ postedBy: companyUser._id });
    if (!opportunity) {
      opportunity = await Opportunity.create({
        postedBy: companyUser._id,
        title: "Full Stack Developer Intern",
        type: "internship",
        description: "Hands-on full stack development internship working with React, Node.js, and scalable architecture.",
        location: "Bengaluru, India",
        isRemote: true,
        stipend: "₹25,000/month",
        requiredSkills: [
          {
            skill: reactSkill._id,
            minLevel: 60,
            weight: 1,
          },
          {
            skill: nodeSkill._id,
            minLevel: 60,
            weight: 1,
          },
          {
            skill: sysDesignSkill._id,
            minLevel: 50,
            weight: 1,
          },
        ],
        applicants: [
          {
            student: studentUser._id,
            status: "applied",
            appliedAt: new Date(),
          },
        ],
      });
      console.log("Created Opportunity:", opportunity._id.toString());
    }

    console.log("--- TEST IDs FOR MATCHING ---");
    console.log("Student User ID:", studentUser._id.toString());
    console.log("Student Profile ID:", studentProfile._id.toString());
    console.log("Opportunity ID:", opportunity._id.toString());
    console.log("-----------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
};

setupTestDocuments();
