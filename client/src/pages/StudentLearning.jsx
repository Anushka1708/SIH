import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings, Clock, BarChart2, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { studentData } from "../data/mockData";

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

export default function StudentLearning() {
  const user = getCurrentUser();
  const [programs, setPrograms] = useState(studentData.learningPrograms);

  const toggleEnroll = (title) => {
    setPrograms((prev) =>
      prev.map((p) => (p.title === title ? { ...p, enrolled: !p.enrolled } : p))
    );
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Learning Programs</h2>
          <p className="text-muted text-sm mb-6">Enroll in courses to build skills employers are looking for.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <div key={p.title} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{p.title}</p>
                    <p className="text-xs text-muted mt-0.5">{p.provider}</p>
                  </div>
                  {p.enrolled && <CheckCircle2 size={18} className="text-green shrink-0" />}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <span className="flex items-center gap-1"><Clock size={13} /> {p.duration}</span>
                  <span className="flex items-center gap-1"><BarChart2 size={13} /> {p.level}</span>
                </div>

                <button
                  onClick={() => toggleEnroll(p.title)}
                  className={p.enrolled ? "btn-ghost !px-4 !py-2 text-xs w-full justify-center" : "btn-primary !px-4 !py-2 text-xs w-full justify-center"}
                >
                  {p.enrolled ? "Unenroll" : "Enroll Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}