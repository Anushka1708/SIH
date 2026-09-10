import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import FacultyProfile from "../models/FacultyProfile.js";
import InstitutionProfile from "../models/InstitutionProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import Opportunity from "../models/Opportunity.js";
import LiveProject from "../models/LiveProject.js";
import Skill from "../models/Skill.js";

dotenv.config();

const DEFAULT_SKILLS = [
  { name: "React", category: "technical", aliases: ["ReactJS", "React.js"], description: "Component-based UI library" },
  { name: "Node.js", category: "technical", aliases: ["NodeJS", "Node"], description: "Event-driven runtime for server-side apps" },
  { name: "Python", category: "technical", aliases: ["Python3", "Py"], description: "Interpreted general-purpose programming language" },
  { name: "System Design", category: "technical", aliases: ["Distributed Systems", "Architecture"], description: "Scalable architecture and design principles" },
  { name: "Cloud DevOps", category: "tool", aliases: ["AWS", "DevOps", "Cloud"], description: "Cloud infrastructure and CI/CD automation" },
  { name: "Docker", category: "tool", aliases: ["Containers", "Containerization"], description: "Container management platform" },
  { name: "MongoDB", category: "technical", aliases: ["Mongo", "NoSQL"], description: "Document-oriented NoSQL database" },
  { name: "TypeScript", category: "technical", aliases: ["TS"], description: "Typed superset of JavaScript" },
  { name: "AI / Machine Learning", category: "domain", aliases: ["AI", "ML", "GenAI"], description: "Statistical algorithms and intelligent agents" },
  { name: "UI/UX Design", category: "domain", aliases: ["Figma", "Design", "User Experience"], description: "User interface and experience design" },
];

export async function seedDemoData() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SkillBridge";
  console.log("Connecting to MongoDB for Demo Seeding...");
  await mongoose.connect(uri);
  console.log("Connected successfully to MongoDB.");

  // 1. Ensure Baseline Skills exist
  console.log("Ensuring baseline skill taxonomy exists...");
  for (const s of DEFAULT_SKILLS) {
    await Skill.findOneAndUpdate(
      { name: s.name },
      { $setOnInsert: s },
      { upsert: true, new: true }
    );
  }

  const skillMap = {};
  const allSkills = await Skill.find();
  allSkills.forEach((sk) => {
    skillMap[sk.name] = sk;
  });

  // 2. Clean previous demo records to ensure pure idempotent re-runs
  const demoEmails = [
    "student@demo.com",
    "faculty@demo.com",
    "college@demo.com",
    "company@demo.com",
  ];

  console.log("Cleaning old demo users and related profiles...");
  const oldUsers = await User.find({ email: { $in: demoEmails } });
  const oldUserIds = oldUsers.map((u) => u._id);

  if (oldUserIds.length > 0) {
    await StudentProfile.deleteMany({ user: { $in: oldUserIds } });
    await FacultyProfile.deleteMany({ user: { $in: oldUserIds } });
    await InstitutionProfile.deleteMany({ user: { $in: oldUserIds } });
    await CompanyProfile.deleteMany({ user: { $in: oldUserIds } });
    await Opportunity.deleteMany({ postedBy: { $in: oldUserIds } });
    await LiveProject.deleteMany({ postedBy: { $in: oldUserIds } });
    await User.deleteMany({ _id: { $in: oldUserIds } });
    console.log(`Removed ${oldUserIds.length} existing demo user trees.`);
  }

  // 3. Create Demo Users (password123 will be automatically hashed by pre("save"))
  console.log("Creating demo accounts with password 'password123'...");
  const studentUser = await User.create({
    name: "Aarav Sharma",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    isVerified: true,
  });

  const facultyUser = await User.create({
    name: "Dr. Rajesh Verma",
    email: "faculty@demo.com",
    password: "password123",
    role: "faculty",
    isVerified: true,
  });

  const institutionUser = await User.create({
    name: "Jabalpur Engineering College",
    email: "college@demo.com",
    password: "password123",
    role: "institution",
    isVerified: true,
  });

  const companyUser = await User.create({
    name: "TechCorp Global Solutions",
    email: "company@demo.com",
    password: "password123",
    role: "company",
    isVerified: true,
  });

  console.log("Created 4 primary demo users:");
  console.log(" - Student:     student@demo.com / password123");
  console.log(" - Faculty:     faculty@demo.com / password123");
  console.log(" - Institution: college@demo.com / password123");
  console.log(" - Company:     company@demo.com / password123");

  // 4. Create Institution Profile
  const institutionProfile = await InstitutionProfile.create({
    user: institutionUser._id,
    institutionName: "Jabalpur Engineering College",
    address: "Gokalpur, Jabalpur, Madhya Pradesh 482011",
    accreditation: "NAAC A++ | NBA Accredited",
    website: "https://www.jecjabalpur.ac.in",
    totalStudents: 4850,
    totalFaculty: 210,
  });

  // 5. Create Faculty Profile
  const facultyProfile = await FacultyProfile.create({
    user: facultyUser._id,
    institution: institutionProfile._id,
    institutionNameRaw: "Jabalpur Engineering College",
    department: "Computer Science & Engineering",
    designation: "Associate Professor & Head of Placements",
    expertiseSkills: [
      skillMap["React"]?._id,
      skillMap["Node.js"]?._id,
      skillMap["Python"]?._id,
      skillMap["System Design"]?._id,
    ].filter(Boolean),
    bio: "Senior faculty member specializing in distributed architectures and industry-academia corporate collaborations.",
    mentorshipCount: 24,
  });

  // 6. Create Student Profile with Evidence-Based Skills & Portfolio
  const studentProfile = await StudentProfile.create({
    user: studentUser._id,
    college: "Jabalpur Engineering College",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    year: 4,
    resumeUrl: "https://skillbridge.storage/resumes/aarav_sharma_resume.pdf",
    resumeFileName: "aarav_sharma_resume.pdf",
    bio: "Final-year Computer Science undergraduate passionate about distributed systems, modern React engineering, and scalable backend services.",
    contactNumber: "+91 98765 43210",
    profileCompletion: 100,
    skills: [
      {
        skill: skillMap["React"]?._id,
        level: 90,
        verified: true,
        evidenceType: "assessment",
        evidenceRef: "ASSESS-REACT-928",
        verifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        skill: skillMap["Node.js"]?._id,
        level: 85,
        verified: true,
        evidenceType: "project",
        evidenceRef: "PROJ-TELEMETRY-MESH",
        verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        skill: skillMap["Python"]?._id,
        level: 80,
        verified: true,
        evidenceType: "faculty-signoff",
        evidenceRef: "FACULTY-SIGN-RAJESH",
        verifiedBy: facultyUser._id,
        verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        skill: skillMap["System Design"]?._id,
        level: 75,
        verified: true,
        evidenceType: "project",
        evidenceRef: "PROJ-DISTRIBUTED-CACHE",
        verifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        skill: skillMap["Cloud DevOps"]?._id,
        level: 65,
        verified: false,
        evidenceType: "self-reported",
      },
    ].filter((s) => s.skill),
    targetRoles: [
      "Full Stack Developer",
      "Cloud Solutions Engineer",
      "AI/ML Associate",
    ],
    portfolio: [
      {
        title: "AI-Powered Talent Matching Engine",
        type: "project",
        description: "Full stack career recommendation portal with Gemini API roadmap generator and automated PDF resume analysis.",
        link: "https://github.com/aarav/skillbridge-ai",
        issuedBy: "Self / Open Source",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Smart India Hackathon Runner Up",
        type: "achievement",
        description: "Developed real-time telemetry mesh for cloud microservices under time-constrained competition.",
        issuedBy: "Smart India Hackathon",
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        title: "AWS Cloud Certified Practitioner",
        type: "certificate",
        description: "Official AWS credential validating cloud architecture fundamentals and security best practices.",
        link: "https://aws.amazon.com/verify/109283",
        issuedBy: "Amazon Web Services",
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    ],
    roadmap: [
      {
        title: "Containerization & Docker Fundamentals",
        description: "Build robust Docker container pipelines and master container lifecycle management.",
        relatedSkill: skillMap["Docker"]?._id,
        done: true,
        youtubeVideoId: "fqMOX6JJhGo",
        youtubeTitle: "Docker Tutorial for Beginners [FULL COURSE in 3 Hours]",
        youtubeChannel: "TechWorld with Nana",
      },
      {
        title: "AWS Cloud Practitioner & Serverless Architecture",
        description: "Automate build verification, unit test suites, and deploy serverless cloud functions.",
        relatedSkill: skillMap["Cloud DevOps"]?._id,
        done: false,
        youtubeVideoId: "2LaAJq1lB1Q",
        youtubeTitle: "AWS Certified Cloud Practitioner Training 2024",
        youtubeChannel: "freeCodeCamp.org",
      },
      {
        title: "Microservices Architecture & System Design Mastery",
        description: "Master load balancing, caching, database sharding, and high-availability patterns.",
        relatedSkill: skillMap["System Design"]?._id,
        done: false,
        youtubeVideoId: "m8Icp_Cid5o",
        youtubeTitle: "System Design for Beginners Course",
        youtubeChannel: "freeCodeCamp.org",
      },
      {
        title: "Full Stack React & Modern State Management",
        description: "Advanced component architecture, custom hooks, and production state performance.",
        relatedSkill: skillMap["React"]?._id,
        done: false,
        youtubeVideoId: "bMknfKXIFA8",
        youtubeTitle: "React Course - Beginner's Tutorial for React JavaScript Library",
        youtubeChannel: "freeCodeCamp.org",
      },
    ],
  });

  // 7. Create Company Profile
  const companyProfile = await CompanyProfile.create({
    user: companyUser._id,
    companyName: "TechCorp Global Solutions",
    industry: "Enterprise Cloud & Software Engineering",
    website: "https://techcorp-global.com",
    location: "Bangalore, India",
    about: "Leading enterprise digital transformation provider architecting cloud native services and high-scale AI systems for Fortune 500 partners.",
    companySize: "500-1000",
  });

  // 8. Create Opportunities with Student Applications
  const opp1 = await Opportunity.create({
    postedBy: companyUser._id,
    company: companyProfile._id,
    title: "Senior Full Stack Intern (MERN + Cloud)",
    type: "internship",
    description: "Build scalable microservices and reactive analytics dashboards. Collaborate directly with senior cloud architects.",
    location: "Bangalore / Hybrid",
    isRemote: false,
    stipend: "₹35,000/month",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    requiredSkills: [
      { skill: skillMap["React"]?._id, minLevel: 75, weight: 1.0 },
      { skill: skillMap["Node.js"]?._id, minLevel: 70, weight: 1.0 },
      { skill: skillMap["Cloud DevOps"]?._id, minLevel: 60, weight: 0.8 },
    ].filter((s) => s.skill),
    status: "open",
    applicants: [
      {
        student: studentUser._id,
        status: "reviewing",
        matchScore: 92,
        matchReasoning: "Strong verified competency in React (90%) and Node.js (85%). Candidate meets all primary prerequisites.",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  const opp2 = await Opportunity.create({
    postedBy: companyUser._id,
    company: companyProfile._id,
    title: "Junior AI & Data Systems Associate",
    type: "job",
    description: "Develop generative AI workflows, model inference services, and semantic vector indexing microservices.",
    location: "Remote",
    isRemote: true,
    stipend: "₹45,000/month",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    requiredSkills: [
      { skill: skillMap["Python"]?._id, minLevel: 75, weight: 1.0 },
      { skill: skillMap["React"]?._id, minLevel: 60, weight: 0.7 },
    ].filter((s) => s.skill),
    status: "open",
    applicants: [
      {
        student: studentUser._id,
        status: "applied",
        matchScore: 84,
        matchReasoning: "Solid Python foundations (80%) and strong React capabilities (90%).",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  const opp3 = await Opportunity.create({
    postedBy: companyUser._id,
    company: companyProfile._id,
    title: "Cloud Infrastructure & SRE Intern",
    type: "internship",
    description: "Deploy and manage resilient Kubernetes clusters, cloud observability telemetry, and automated deployment pipelines.",
    location: "Hyderabad",
    isRemote: false,
    stipend: "₹30,000/month",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    requiredSkills: [
      { skill: skillMap["Cloud DevOps"]?._id, minLevel: 70, weight: 1.0 },
      { skill: skillMap["System Design"]?._id, minLevel: 65, weight: 0.9 },
    ].filter((s) => s.skill),
    status: "open",
    applicants: [],
  });

  // 9. Create Live Industry Project with Faculty and Student Assignment
  const liveProject = await LiveProject.create({
    title: "Enterprise Event-Driven Telemetry Service",
    description: "Architect and implement an asynchronous telemetry streaming mesh for cloud microservices with backpressure handling.",
    postedBy: companyUser._id,
    assignedFaculty: facultyUser._id,
    assignedStudents: [studentUser._id],
    requiredSkills: [skillMap["Node.js"]?._id, skillMap["System Design"]?._id].filter(Boolean),
    status: "in-progress",
    milestones: [
      {
        title: "Milestone 1: Architectural Schema & API Specification",
        description: "Formulate event topology, message contracts, and rate-limiting schemas.",
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: "completed",
        studentNotes: "Submitted complete AsyncAPI specification and prototype architecture diagrams.",
        facultyFeedback: "Approved by Dr. Rajesh Verma. Excellent throughput analysis.",
        verifiedBy: facultyUser._id,
        verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Milestone 2: Distributed Worker Queue Implementation",
        description: "Implement Redis stream consumers with idempotent delivery guarantees.",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "in-progress",
        studentNotes: "Core event processor completed; currently load testing under 10k req/sec.",
      },
    ],
    skillsAwarded: [
      { skill: skillMap["Node.js"]?._id, level: 90 },
      { skill: skillMap["System Design"]?._id, level: 85 },
    ].filter((s) => s.skill),
  });

  console.log("\n=======================================================");
  console.log("🎉 SkillBridge Demo Data Seed Completed Successfully!");
  console.log("=======================================================");
  console.log("Demo Accounts (Password: password123):");
  console.log("1. Student:     student@demo.com (Aarav Sharma - Profile 100%, 5 verified skills, 2 applications)");
  console.log("2. Faculty:     faculty@demo.com (Dr. Rajesh Verma - JEC Placement Head, 1 Live Project)");
  console.log("3. Institution: college@demo.com (Jabalpur Engineering College - NAAC A++)");
  console.log("4. Company:     company@demo.com (TechCorp Global - 3 Opportunities, 1 Live Project)");
  console.log("=======================================================\n");
}

// Execute if run directly via CLI
if (process.argv[1]?.endsWith("seedDemoData.js")) {
  seedDemoData()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Demo seeding failed:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
