import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings, CheckCircle2, Circle } from "lucide-react";
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

export default function StudentSkills() {
  const user = getCurrentUser();
  const [skills, setSkills] = useState(studentData.skillAssessments);
  const [taking, setTaking] = useState(null);

  const handleTakeAssessment = (name) => {
    setTaking(name);
    // simulate an assessment completing after a short delay
    setTimeout(() => {
      setSkills((prev) =>
        prev.map((s) =>
          s.name === name
            ? { ...s, percent: Math.min(100, s.percent + 25), verified: true }
            : s
        )
      );
      setTaking(null);
    }, 1200);
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6 max-w-3xl">
          <h2 className="text-xl font-extrabold mb-1">Skills & Assessment</h2>
          <p className="text-muted text-sm mb-6">Take assessments to verify your skills and boost your profile.</p>

          <div className="card">
            <ul className="flex flex-col gap-5">
              {skills.map((s) => (
                <li key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {s.verified ? (
                        <CheckCircle2 size={16} className="text-green" />
                      ) : (
                        <Circle size={16} className="text-muted" />
                      )}
                      <span className="text-sm font-medium text-[#1E1B33]">{s.name}</span>
                      {s.verified && (
                        <span className="status-pill bg-greenSoft text-green">Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted font-mono">{s.percent}%</span>
                      <button
                        onClick={() => handleTakeAssessment(s.name)}
                        disabled={taking === s.name}
                        className="btn-primary !px-4 !py-1.5 text-xs"
                      >
                        {taking === s.name ? "Testing..." : s.percent > 0 ? "Retake" : "Take Test"}
                      </button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}