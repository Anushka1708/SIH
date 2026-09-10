import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  CheckCircle2,
  Circle,
  Loader2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AssessmentModal from "../components/AssessmentModal";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";

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

const evidenceLabels = {
  assessment: { label: "Assessment", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  project: { label: "Project Verified", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  certificate: { label: "Certificate", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "faculty-signoff": { label: "Faculty Sign-Off", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "self-reported": { label: "Self-Reported", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function StudentSkills() {
  const user = getCurrentUser();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeModalSkill, setActiveModalSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/profile/me");
      const profileSkills = res.data.profile?.skills || [];
      setSkills(profileSkills);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError("Failed to load skills profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentComplete = (updatedSkills) => {
    if (updatedSkills) {
      setSkills(updatedSkills);
    } else {
      fetchSkills();
    }
  };

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Skills & Assessment" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 max-w-3xl w-full mx-auto"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-extrabold text-[#1E1B33] dark:text-[#F3F4F6]">
              Skills & Assessment
            </h2>
            <span className="text-xs text-muted font-medium">
              Evidence-Based Skill Vector
            </span>
          </div>
          <p className="text-muted text-xs md:text-sm mb-6">
            Complete interactive assessments or submit live project deliverables to verify competencies and boost your match accuracy.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="card">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading verified skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="py-12 text-center text-muted">
                <ShieldCheck className="mx-auto mb-3 text-muted" size={32} />
                <p className="font-semibold text-sm text-[#1E1B33] dark:text-[#F3F4F6]">
                  No skills recorded yet
                </p>
                <p className="text-xs mt-1 max-w-sm mx-auto">
                  Upload your resume or add target competencies to take interactive quiz assessments.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {skills.map((s, index) => {
                  const skillId = (s.skill?._id || s.skill || index).toString();
                  const skillName = s.skill?.name || `Skill ${index + 1}`;
                  const level = s.level || 0;
                  const evidence = evidenceLabels[s.evidenceType] || evidenceLabels["self-reported"];

                  return (
                    <li key={skillId}>
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {s.verified ? (
                            <CheckCircle2 size={16} className="text-green" />
                          ) : (
                            <Circle size={16} className="text-muted" />
                          )}
                          <span className="text-sm font-semibold text-[#1E1B33] dark:text-[#F3F4F6]">
                            {skillName}
                          </span>

                          {s.verified && (
                            <span className="status-pill bg-greenSoft text-green text-[11px] font-semibold">
                              Verified
                            </span>
                          )}

                          <span
                            className={`border text-[10px] font-semibold px-2 py-0.5 rounded-md ${evidence.color}`}
                          >
                            {evidence.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted font-mono font-bold">
                            {level === 0 ? "Unassessed" : `${level}%`}
                          </span>
                          <button
                            onClick={() => setActiveModalSkill(s)}
                            className="btn-primary !px-4 !py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <HelpCircle size={12} />
                            {s.verified ? "Retake Topic Test" : level > 0 ? "Retake Test" : "Start Assessment"}
                          </button>
                        </div>
                      </div>

                      <div className="h-2 bg-bg dark:bg-[#1E1B3B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Interactive Assessment Modal */}
      {activeModalSkill && (
        <AssessmentModal
          skillEntry={activeModalSkill}
          onClose={() => setActiveModalSkill(null)}
          onVerified={handleAssessmentComplete}
        />
      )}
    </div>
  );
}