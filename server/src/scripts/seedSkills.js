import mongoose from "mongoose";
import dotenv from "dotenv";
import Skill from "../models/Skill.js";

dotenv.config();

const skillsData = [
  { name: "React", category: "technical", aliases: ["ReactJS", "React.js"], description: "Frontend library for building UIs.", related: ["Node.js", "TypeScript", "JavaScript"] },
  { name: "Node.js", category: "technical", aliases: ["NodeJS"], description: "JavaScript runtime for backend services.", related: ["React", "MongoDB", "REST APIs"] },
  { name: "JavaScript", category: "technical", aliases: ["JS"], description: "Core scripting language of the web.", related: ["React", "Node.js", "TypeScript"] },
  { name: "TypeScript", category: "technical", aliases: ["TS"], description: "Typed superset of JavaScript.", related: ["React", "JavaScript"] },
  { name: "Python", category: "technical", aliases: ["Py"], description: "General-purpose language popular in ML/data.", related: ["Machine Learning", "Data Structures & Algorithms"] },
  { name: "MongoDB", category: "technical", aliases: ["Mongo"], description: "NoSQL document database.", related: ["Node.js", "SQL"] },
  { name: "SQL", category: "technical", aliases: ["Structured Query Language"], description: "Relational database query language.", related: ["MongoDB"] },
  { name: "System Design", category: "technical", aliases: ["HLD", "System Architecture"], description: "Designing scalable, reliable software systems.", related: ["Data Structures & Algorithms", "REST APIs"] },
  { name: "Data Structures & Algorithms", category: "technical", aliases: ["DSA"], description: "Core CS fundamentals for problem solving.", related: ["Python", "System Design"] },
  { name: "REST APIs", category: "technical", aliases: ["RESTful APIs", "REST"], description: "Standard for building web APIs.", related: ["Node.js", "System Design"] },
  { name: "Docker", category: "technical", aliases: [], description: "Containerization platform for shipping apps.", related: ["Git"] },
  { name: "Git", category: "technical", aliases: ["Version Control"], description: "Distributed version control system.", related: ["Docker"] },
  { name: "Machine Learning", category: "technical", aliases: ["ML"], description: "Building models that learn from data.", related: ["Python"] },
  { name: "Communication", category: "soft", aliases: [], description: "Clearly conveying ideas verbally and in writing.", related: ["Teamwork", "Leadership"] },
  { name: "Teamwork", category: "soft", aliases: ["Collaboration"], description: "Working effectively with others toward a shared goal.", related: ["Communication"] },
  { name: "Problem Solving", category: "soft", aliases: [], description: "Analyzing issues and identifying effective solutions.", related: ["Data Structures & Algorithms"] },
  { name: "Time Management", category: "soft", aliases: [], description: "Prioritizing and organizing work effectively.", related: [] },
  { name: "Leadership", category: "soft", aliases: [], description: "Guiding and motivating a team toward outcomes.", related: ["Communication", "Teamwork"] },
  { name: "Adaptability", category: "soft", aliases: ["Flexibility"], description: "Adjusting effectively to new conditions.", related: [] },
  { name: "Critical Thinking", category: "soft", aliases: [], description: "Objective analysis and evaluation of an issue.", related: ["Problem Solving"] },
  { name: "Fintech", category: "domain", aliases: ["Financial Technology"], description: "Technology applied to financial services.", related: [] },
  { name: "Healthcare IT", category: "domain", aliases: ["HealthTech"], description: "IT systems applied to healthcare.", related: [] },
  { name: "EdTech", category: "domain", aliases: ["Education Technology"], description: "Technology applied to education.", related: [] },
  { name: "Cybersecurity", category: "domain", aliases: ["InfoSec"], description: "Protecting systems and data from threats.", related: ["System Design"] },
  { name: "IoT", category: "domain", aliases: ["Internet of Things"], description: "Networked physical devices and sensors.", related: [] },
  { name: "E-commerce", category: "domain", aliases: ["Ecommerce"], description: "Domain knowledge of online retail systems.", related: [] },
  { name: "Figma", category: "tool", aliases: [], description: "UI/UX design and prototyping tool.", related: [] },
  { name: "Postman", category: "tool", aliases: [], description: "API testing and development tool.", related: ["REST APIs"] },
  { name: "VS Code", category: "tool", aliases: ["Visual Studio Code"], description: "Popular source code editor.", related: ["Git"] },
  { name: "Jira", category: "tool", aliases: [], description: "Project and issue tracking tool.", related: [] },
  { name: "AWS Console", category: "tool", aliases: ["Amazon Web Services"], description: "Cloud infrastructure management console.", related: ["Docker"] },
];

const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding.");

    console.warn("Wiping existing Skill collection before reseeding...");
    await Skill.deleteMany({});

    const nameToId = {};
    for (const s of skillsData) {
      const doc = await Skill.create({
        name: s.name,
        category: s.category,
        aliases: s.aliases,
        description: s.description,
      });
      nameToId[s.name] = doc._id;
    }
    console.log(`Inserted ${skillsData.length} skills (pass 1).`);

    let linkedCount = 0;
    for (const s of skillsData) {
      if (!s.related || s.related.length === 0) continue;
      const relatedIds = s.related.map((n) => nameToId[n]).filter(Boolean);

      if (relatedIds.length > 0) {
        await Skill.findByIdAndUpdate(nameToId[s.name], {
          $set: { relatedSkills: relatedIds },
        });
        linkedCount++;
      }
    }
    console.log(`Linked relatedSkills for ${linkedCount} skills (pass 2).`);

    const total = await Skill.countDocuments();
    console.log(`Seeding complete. Total skills in DB: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedSkills();
