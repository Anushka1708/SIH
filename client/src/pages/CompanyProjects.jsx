import { LayoutDashboard, Send, FileText, Users, FolderKanban, BarChart3, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/company" },
  { label: "Post Opportunity", icon: Send, href: "/company/postopportunity" },
  { label: "Applications", icon: FileText, href: "/company/applications" },
  { label: "Internships", icon: Users, href: "/company/internships" },
  { label: "Projects", icon: FolderKanban, href: "/company/projects" },
  { label: "Profile", icon: Users, href: "/company/profile" },
  { label: "Analytics", icon: BarChart3, href: "/company/analytics" },
  { label: "Settings", icon: Settings, href: "/company/settings" },
];

export default function CompanyProjects() {
  const user = getCurrentUser();
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.companyName || user?.name} subtitle="Company" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search candidates, skills..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Projects</h2>
          <p className="text-muted text-sm mb-6">Manage collaborative projects posted for students.</p>
          <div className="card">
            {/* TODO: project cards with status */}
            <p className="text-sm text-muted">Projects list goes here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}