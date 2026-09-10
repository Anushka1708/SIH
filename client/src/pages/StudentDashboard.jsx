import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import OpportunityCard from "../components/OpportunityCard";
import RoadmapStep from "../components/RoadmapStep";
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

import { motion } from "framer-motion";

export default function StudentDashboard() {
  const user = getCurrentUser();
  const displayName = user?.name || "Student";
  const firstName = displayName.split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [liveProjects, setLiveProjects] = useState([]);
  const [applyingProjectId, setApplyingProjectId] = useState(null);
  const [projectMessage, setProjectMessage] = useState("");
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Profile
        const profRes = await api.get("/profile/me").catch(() => ({ data: {} }));
        const pData = profRes.data?.profile || null;
        setProfile(pData);

        // 2. Fetch Opportunities
        const oppRes = await api.get("/opportunities").catch(() => ({ data: {} }));
        const allOpps = oppRes.data?.opportunities || [];
        setOpportunities(allOpps.slice(0, 3));

        // Count applications
        if (user?.id) {
          const count = allOpps.filter((o) =>
            o.applicants?.some(
              (a) => (a.student?._id || a.student)?.toString() === user.id.toString()
            )
          ).length;
          setApplicationCount(count);
        }

        // 3. Fetch Open Live Projects
        const projRes = await api.get("/projects").catch(() => ({ data: {} }));
        const allProjects = projRes.data?.projects || [];
        setLiveProjects(allProjects.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApplyProject = async (projectId) => {
    try {
      setApplyingProjectId(projectId);
      setProjectMessage("");

      await api.post(`/projects/${projectId}/apply`, { studentId: user?.id });
      setProjectMessage("Applied to live project successfully!");

      // Update local state
      setLiveProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? { ...p, assignedStudents: [...(p.assignedStudents || []), user?.id] }
            : p
        )
      );
      setTimeout(() => setProjectMessage(""), 4000);
    } catch (err) {
      console.error("Project apply failed:", err);
      setProjectMessage(err.response?.data?.error || "Failed to apply to live project.");
      setTimeout(() => setProjectMessage(""), 4000);
    } finally {
      setApplyingProjectId(null);
    }
  };

  const skillsCount = profile?.skills?.length || 0;
  const verifiedCount = profile?.skills?.filter((s) => s.verified)?.length || 0;
  const assessmentsCount =
    profile?.skills?.filter((s) => s.evidenceType === "assessment")?.length || 0;
  const roadmapSteps = profile?.roadmap || [];

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Student" items={items} active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0"
        >
          <div
            className="rounded-2xl p-6 md:p-7 mb-6 text-white shadow-md relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #8B5CF6 100%)" }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tight">Good Day, {firstName}! 👋</h2>
              <p className="text-white/85 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
                Your evidence-based skill vector and live industry match engine are active. Track your applications and close skill gaps in real-time.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Live Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="✅"
              label="Profile Completion"
              value={`${profile?.profileCompletion || (profile?.resumeUrl || profile?.resumeFileName ? 100 : profile?.college ? 85 : 50)}%`}
              change={profile?.resumeUrl || profile?.resumeFileName ? "Resume Verified" : "Verified"}
              color="green"
            />
            <StatCard
              icon="🏅"
              label="Skills Verified"
              value={verifiedCount}
              change={`${skillsCount} total skills`}
              color="primary"
            />
            <StatCard
              icon="📝"
              label="Assessments Completed"
              value={assessmentsCount}
              color="primary"
            />
            <StatCard
              icon="📄"
              label="Active Applications"
              value={applicationCount}
              color="amber"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Opportunities Section */}
            <div className="md:col-span-2 card">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-[#1E1B33] text-sm">
                  Recommended Opportunities
                </p>
                <Link to="/student/opportunities" className="text-xs text-primary font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {opportunities.length === 0 ? (
                <p className="text-xs text-muted py-6 text-center">No opportunities posted yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {opportunities.map((o) => (
                    <div
                      key={o._id}
                      className="border border-[#ECEBF5] dark:border-[#2E2A52] bg-slate-50/50 dark:bg-[#1E1B3B] rounded-xl p-3.5 flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#1E1B33] dark:text-[#F3F4F6]">{o.title}</p>
                        <p className="text-xs text-muted dark:text-[#9CA3AF]">
                          {o.company?.companyName || "Verified Partner"} · {o.location || "Remote"} · {o.type}
                        </p>
                      </div>
                      <Link
                        to="/student/opportunities"
                        className="btn-ghost !px-3 !py-1 text-xs"
                      >
                        Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Projects Pipeline Section */}
            <div className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[#1E1B33] text-sm flex items-center gap-1.5">
                    <FolderKanban size={16} className="text-primary" /> Live Industry Projects
                  </p>
                </div>

                {projectMessage && (
                  <p className="text-xs text-green bg-greenSoft p-2 rounded mb-2 font-medium">
                    {projectMessage}
                  </p>
                )}

                {liveProjects.length === 0 ? (
                  <p className="text-xs text-muted py-6 text-center">No open projects right now.</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {liveProjects.map((p) => {
                      const isAssigned = p.assignedStudents?.some(
                        (s) => (s._id || s)?.toString() === user?.id?.toString()
                      );

                      return (
                        <div
                          key={p._id}
                          className="border border-slate-100 dark:border-[#2E2A52] bg-slate-50/60 dark:bg-[#1E1B3B] rounded-xl p-3.5 transition-colors"
                        >
                          <p className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6] line-clamp-1">{p.title}</p>
                          <p className="text-[11px] text-muted dark:text-[#9CA3AF] line-clamp-1 mb-2.5">
                            {p.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-md">
                              Earns Verified Skill
                            </span>
                            {isAssigned ? (
                              <span className="text-[10px] font-semibold text-primary dark:text-indigo-300 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-md">
                                <CheckCircle2 size={11} /> Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApplyProject(p._id)}
                                disabled={applyingProjectId === p._id}
                                className="btn-primary !px-2.5 !py-1 text-[11px] flex items-center gap-1"
                              >
                                {applyingProjectId === p._id && (
                                  <Loader2 size={10} className="animate-spin" />
                                )}
                                Bid / Apply
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Roadmap Steps */}
          {roadmapSteps.length > 0 && (
            <div className="card mt-6">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-[#1E1B33] text-sm">Active AI Learning Roadmap</p>
                <Link to="/student/learning" className="text-xs text-primary font-semibold hover:underline">
                  Full Roadmap
                </Link>
              </div>
              {roadmapSteps.slice(0, 3).map((r, i) => (
                <RoadmapStep
                  key={r._id || i}
                  step={i + 1}
                  title={r.title}
                  description={r.description}
                  done={r.done}
                  last={i === 2 || i === roadmapSteps.length - 1}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}