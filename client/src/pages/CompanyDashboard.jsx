import { LayoutDashboard, Send, FileText, Users, FolderKanban, BarChart3, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ActivityCard from "../components/ActivityCard";
import SkillCard from "../components/SkillCard";
import { companyData as d } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Post Opportunity", icon: Send },
  { label: "Applications", icon: FileText },
  { label: "Internships", icon: Users },
  { label: "Projects", icon: FolderKanban },
  { label: "Profile", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function CompanyDashboard() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || d.name;

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={items} active="Dashboard" />
      <div className="flex-1">
        <Topbar placeholder="Search candidates, skills..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Welcome back, {displayName}!</h2>
          <p className="text-muted text-sm mb-6">Find the right talent. Build the future.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {d.stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-[#1E1B33] text-sm">Recent Applications</p>
                <a href="#" className="text-xs text-primary font-semibold">View All</a>
              </div>
              {d.recentApplications.map((a) => <ActivityCard key={a.name} {...a} />)}
            </div>

            <div className="card">
              <p className="font-semibold text-[#1E1B33] text-sm mb-4">Top Skills in Applications</p>
              <SkillCard skills={d.topSkills} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}