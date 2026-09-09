import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ProgressCard from "../components/ProgressCard";
import OpportunityCard from "../components/OpportunityCard";
import RoadmapStep from "../components/RoadmapStep";
import { studentData as d } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Opportunities", icon: Briefcase, href: "/student/opportunities" },
  { label: "Applications", icon: FileText, href: "/student/applications" },
  { label: "Resume & Portfolio", icon: FileEdit, href: "/student/resume" },
  { label: "Learning Programs", icon: BookOpen, href: "/student/learning" },
  { label: "Settings", icon: Settings, href: "/student/settings" },
];

export default function StudentDashboard() {
  const user = getCurrentUser();
  const displayName = user?.name || d.name;
  const firstName = displayName.split(" ")[0];

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle={d.role} items={items} active="Dashboard" />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6">
          <div className="rounded-xl2 p-6 mb-6 text-white"
            style={{ background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)" }}>
            <h2 className="text-xl font-extrabold">Good Morning, {firstName}! 👋</h2>
            <p className="text-white/80 text-sm mt-1">Keep learning, keep growing. Your future is waiting!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon="✅" label="Profile Completion" value={`${d.profileCompletion}%`} change="On track" color="green" />
            <StatCard icon="🏅" label="Skills Verified" value={d.skillsVerified} color="primary" />
            <StatCard icon="📝" label="Assessments Taken" value={d.assessmentsTaken} color="primary" />
            <StatCard icon="📄" label="Applications" value={d.applications} color="amber" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-[#1E1B33] text-sm">Recommended Opportunities</p>
                <a href="#" className="text-xs text-primary font-semibold">View All</a>
              </div>
              <div className="flex flex-col gap-3">
                {d.opportunities.map((o) => <OpportunityCard key={o.title} {...o} />)}
              </div>
            </div>
            <ProgressCard percent={d.skillProgress} skills={d.skills} />
          </div>

          <div className="card mt-6">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4">Your Roadmap</p>
            {d.roadmap.map((r, i) => (
              <RoadmapStep key={r.title} step={i + 1} {...r} last={i === d.roadmap.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}