import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ActivityCard from "../components/ActivityCard";
import EmptyState from "../components/EmptyState";
import { studentData } from "../data/mockData";
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

const statuses = ["All", "Applied", "Shortlisted", "Interview"];

export default function StudentApplications() {
  const user = getCurrentUser();
  const displayName = user?.name || "Student";

  const [status, setStatus] = useState("All");

  const filtered = studentData.applicationsList.filter(
    (a) => status === "All" || a.status === status
  );

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Applications</h2>
          <p className="text-muted text-sm mb-6">Track the status of everything you've applied to.</p>

          <div className="flex gap-2 mb-6">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl border ${
                  status === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-[#ECEBF5] text-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="card">
            {filtered.length === 0 ? (
              <EmptyState
                title="No applications found"
                message="You haven't applied to anything in this category yet."
              />
            ) : (
              filtered.map((a) => <ActivityCard key={a.name + a.role} {...a} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}