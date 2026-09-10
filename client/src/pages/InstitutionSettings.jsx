import { LayoutDashboard, Users, GraduationCap, Handshake, BookOpen, BarChart3, Settings as SettingsIcon } from "lucide-react";
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
  { label: "Settings", icon: SettingsIcon, href: "/institution/settings" },
];

export default function InstitutionSettings() {
  const user = getCurrentUser();
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.institutionName || user?.name} subtitle="Institution" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search students, programs..." />
        <div className="p-6 max-w-2xl">
          <h2 className="text-xl font-extrabold mb-1">Settings</h2>
          <p className="text-muted text-sm mb-6">Manage account preferences.</p>
          <div className="card">
            {/* TODO: password change, notifications, logout - follow StudentSettings.jsx pattern */}
            <p className="text-sm text-muted">Settings form goes here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}