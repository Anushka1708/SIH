import { LayoutDashboard, Users, GraduationCap, Handshake, BookOpen, BarChart3, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { institutionData as d } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/institution" },
  { label: "Students", icon: Users, href: "/institution/students" },
  { label: "Faculty", icon: GraduationCap, href: "/institution/faculty" },
  { label: "Collaborations", icon: Handshake, href: "/institution/collaborations" },
  { label: "Learning Programs", icon: BookOpen, href: "/institution/learning" },
  { label: "Reports", icon: BarChart3, href: "/institution/reports" },
  { label: "Settings", icon: Settings, href: "/institution/settings" },
];

const statusStyle = {
  Active: "bg-greenSoft text-green",
  Upcoming: "bg-amberSoft text-amber",
  Completed: "bg-bg text-muted",
};

export default function InstitutionDashboard() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || d.name;
  const max = Math.max(...d.enrollment);

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={items} active="Dashboard" />
      <div className="flex-1">
        <Topbar placeholder="Search students, programs..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Welcome, {displayName}!</h2>
          <p className="text-muted text-sm mb-6">Empowering students through industry collaboration.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {d.stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <p className="font-semibold text-[#1E1B33] text-sm mb-4">Student Enrollment</p>
              <div className="flex items-end gap-3 h-40">
                {d.enrollment.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary rounded-t-md" style={{ height: `${(v / max) * 100}%` }} />
                    <span className="text-xs text-muted font-mono">{d.months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-[#1E1B33] text-sm">Recent Collaborations</p>
                <a href="#" className="text-xs text-primary font-semibold">View All</a>
              </div>
              <ul>
                {d.collaborations.map((c) => (
                  <li key={c.name} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1B33]">{c.name}</p>
                      <p className="text-xs text-muted">{c.type}</p>
                    </div>
                    <span className={`status-pill ${statusStyle[c.status]}`}>{c.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}