import { LayoutDashboard, BookOpen, Users, ClipboardList, Handshake, User, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/faculty" },
  { label: "Courses", icon: BookOpen, href: "/faculty/courses" },
  { label: "Students", icon: Users, href: "/faculty/students" },
  { label: "Assessments", icon: ClipboardList, href: "/faculty/assessments" },
  { label: "Mentorship", icon: Handshake, href: "/faculty/mentorship" },
  { label: "Profile", icon: User, href: "/faculty/profile" },
  { label: "Settings", icon: Settings, href: "/faculty/settings" },
];

export default function FacultyAssessments() {
  const user = getCurrentUser();
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Faculty" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search students, courses..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Assessments</h2>
          <p className="text-muted text-sm mb-6">Create and review student assessments.</p>
          <div className="card">
            {/* TODO: pending/graded assessments list */}
            <p className="text-sm text-muted">Assessments list goes here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}