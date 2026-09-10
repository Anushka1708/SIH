import { LayoutDashboard, Users, GraduationCap, Handshake, BookOpen, BarChart3, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
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

export default function InstitutionReports() {
  const user = getCurrentUser();
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.institutionName || user?.name} subtitle="Institution" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search students, programs..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Reports</h2>
          <p className="text-muted text-sm mb-6">Placement, enrollment and performance reports.</p>
          <div className="card">
            {/* TODO: charts and exportable reports */}
            <p className="text-sm text-muted">Reports go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}