export const studentData = {
  name: "Anushka Gurjar",
  role: "Student",
  profileCompletion: 80,
  skillsVerified: 6,
  assessmentsTaken: 3,
  applications: 5,
  skillProgress: 70,
  skills: [
    { name: "JavaScript", percent: 85 },
    { name: "React", percent: 72 },
    { name: "Node.js", percent: 68 },
    { name: "MongoDB", percent: 40 },
  ],
  opportunities: [
  { title: "Frontend Developer Intern", company: "TechNova Solutions", location: "Remote", stipend: "₹15k/month", type: "Internship", matched: ["React", "CSS"], gap: ["TypeScript"] },
  { title: "Full Stack Developer Intern", company: "ByteLabs", location: "Hybrid", stipend: "₹20k/month", type: "Internship", matched: ["Node.js", "MongoDB"], gap: ["GraphQL"] },
  { title: "AI/ML Summer Internship", company: "InnovateAI", location: "Remote", stipend: "₹25k/month", type: "Internship", matched: ["Python"], gap: ["TensorFlow", "ML Ops"] },
  { title: "Data Analyst", company: "InsightCo", location: "Bangalore", stipend: "₹25,000/mo", type: "Job", matched: ["SQL", "Excel"], gap: ["Python"] },
  { title: "UI/UX Design Project", company: "Creativo Studio", location: "Remote", stipend: "₹8,000", type: "Project", matched: ["Figma"], gap: ["User Research"] },
  ],
  roadmap: [
    { title: "Complete profile", description: "Add skills, projects and resume.", done: true },
    { title: "Verify skills", description: "Take assessments to get verified badges.", done: true },
    { title: "Apply to internships", description: "Send applications to matched roles.", done: false },
    { title: "Get placed", description: "Land your first internship or job.", done: false },
  ],
  applicationsList: [
  { name: "TechNova Solutions", info: "Applied on 2 Sep", role: "Frontend Developer Intern", status: "Shortlisted", time: "2d ago" },
  { name: "ByteLabs", info: "Applied on 30 Aug", role: "Full Stack Developer Intern", status: "Applied", time: "5d ago" },
  { name: "InnovateAI", info: "Applied on 25 Aug", role: "AI/ML Summer Internship", status: "Interview", time: "1w ago" },
  { name: "InsightCo", info: "Applied on 20 Aug", role: "Data Analyst", status: "Applied", time: "2w ago" },
  ],
  skillAssessments: [
  { name: "JavaScript", percent: 85, verified: true },
  { name: "React", percent: 72, verified: true },
  { name: "Node.js", percent: 68, verified: false },
  { name: "MongoDB", percent: 40, verified: false },
  { name: "TypeScript", percent: 0, verified: false },
  { name: "Python", percent: 55, verified: true },
  ],
  learningPrograms: [
  { title: "Full Stack Web Development & Microservices", provider: "SWAYAM / NPTEL (IIT Kharagpur)", duration: "8 weeks", level: "NSQF Level 6 · NCrF 4.0", enrolled: false, nsqfCode: "NSQF-L6", accreditation: "SWAYAM / NPTEL", link: "https://swayam.gov.in" },
  { title: "Applied Data Structures & Algorithm Design", provider: "NSDC / Skill India Digital Hub", duration: "10 weeks", level: "NSQF Level 6 · NCrF 4.5", enrolled: true, nsqfCode: "NSQF-L6", accreditation: "NSDC Accredited", link: "https://www.skillindiadigital.gov.in" },
  { title: "Cloud Architecture & DevOps Engineering", provider: "SWAYAM / AICTE Approved", duration: "6 weeks", level: "NSQF Level 7 · NCrF 5.0", enrolled: false, nsqfCode: "NSQF-L7", accreditation: "AICTE / SWAYAM", link: "https://swayam.gov.in" },
  { title: "Generative AI Engineering & LLMOps", provider: "SkillBridge Center of Excellence", duration: "6 weeks", level: "NSQF Level 7 · NCrF 5.0", enrolled: false, nsqfCode: "NSQF-L7", accreditation: "Industry Verified", link: "https://swayam.gov.in" },
],
};

export const companyData = {
  name: "TechNova Solutions",
  stats: [
    { label: "Total Applications", value: 124, change: "+12% from last week", icon: "📄", color: "primary" },
    { label: "Shortlisted", value: 32, change: "+8% from last week", icon: "⭐", color: "amber" },
    { label: "Hired", value: 8, change: "+33% from last week", icon: "✅", color: "green" },
    { label: "Active Postings", value: 5, change: "2 closing soon", icon: "📌", color: "red" },
  ],
  recentApplications: [
    { name: "Priya Sharma", info: "B.Tech CSE · 3rd Year", role: "Frontend Developer Intern", status: "Applied", time: "2h ago" },
    { name: "Rohan Verma", info: "B.Tech CSE · 4th Year", role: "Frontend Developer Intern", status: "Shortlisted", time: "5h ago" },
    { name: "Sneha Patel", info: "B.Tech ECE · 3rd Year", role: "Backend Developer Intern", status: "Interview", time: "1d ago" },
  ],
  topSkills: [
    { name: "JavaScript", percent: 85 },
    { name: "React", percent: 72 },
    { name: "Node.js", percent: 68 },
    { name: "Python", percent: 54 },
    { name: "MongoDB", percent: 49 },
  ],
};

export const institutionData = {
  name: "Jabalpur Engineering College",
  stats: [
    { label: "Total Students", value: "2,450", change: "+5%", icon: "🎓", color: "primary" },
    { label: "Faculty Members", value: 120, change: "+2%", icon: "🧑‍🏫", color: "green" },
    { label: "Active Collaborations", value: 18, change: "+8%", icon: "🤝", color: "amber" },
    { label: "Placement Rate", value: "78%", change: "+6%", icon: "📈", color: "green" },
  ],
  enrollment: [1200, 1500, 1800, 2000, 2300, 2450],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  collaborations: [
    { name: "TechNova Solutions", type: "Internship Program", status: "Active" },
    { name: "InnovateAI", type: "Guest Lecture Series", status: "Upcoming" },
    { name: "GlobalSoft", type: "Campus Recruitment", status: "Completed" },
  ],
};

export const facultyData = {
  name: "Dr. Rajesh Verma",
  designation: "Placement Head & Senior Professor",
  stats: [
    { label: "Total Students", value: 48, change: "+5%", icon: "🎓", color: "primary" },
    { label: "Active Courses", value: 6, change: "+2%", icon: "📚", color: "green" },
    { label: "Mentorship Sessions", value: 12, change: "+1%", icon: "🤝", color: "amber" },
    { label: "Pending Assessments", value: 3, change: "-1%", icon: "📝", color: "red" },
  ],
  sessions: [
    { title: "Career Guidance Session", time: "Today · 11:00 AM - 12:00 PM" },
    { title: "Web Development Workshop", time: "Tomorrow · 09:00 AM - 04:00 PM" },
    { title: "Industry Expert Talk", time: "Fri, 10 May · 11:00 AM - 12:30 PM" },
  ],
  performance: { score: 78, excellent: 35, good: 42, needsImprovement: 18, poor: 5 },
};