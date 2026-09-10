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
    { title: "Frontend Developer Intern", company: "TechNova Solutions", location: "Remote", stipend: "₹15k/month", matched: ["React", "CSS"], gap: ["TypeScript"] },
    { title: "Full Stack Developer Intern", company: "ByteLabs", location: "Hybrid", stipend: "₹20k/month", matched: ["Node.js", "MongoDB"], gap: ["GraphQL"] },
    { title: "AI/ML Summer Internship", company: "InnovateAI", location: "Remote", stipend: "₹25k/month", matched: ["Python"], gap: ["TensorFlow", "ML Ops"] },
  ],
  roadmap: [
    { title: "Complete profile", description: "Add skills, projects and resume.", done: true },
    { title: "Verify skills", description: "Take assessments to get verified badges.", done: true },
    { title: "Apply to internships", description: "Send applications to matched roles.", done: false },
    { title: "Get placed", description: "Land your first internship or job.", done: false },
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
  name: "Dr. R. Sharma",
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