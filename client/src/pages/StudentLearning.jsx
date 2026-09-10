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
  Clock,
  BarChart2,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RoadmapStep from "../components/RoadmapStep";
import { getCurrentUser } from "../utils/auth";
import { studentData } from "../data/mockData";
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

export default function StudentLearning() {
  const user = getCurrentUser();
  const [programs, setPrograms] = useState(studentData.learningPrograms);
  const [roadmap, setRoadmap] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRoadmap = async () => {
    if (!user?.id) return;
    try {
      setLoadingRoadmap(true);
      setError("");

      const res = await api.get(`/roadmaps/student/${user.id}`);
      setRoadmap(res.data.roadmap || []);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      // Fallback: try profile/me
      try {
        const profRes = await api.get("/profile/me");
        setRoadmap(profRes.data.profile?.roadmap || []);
      } catch (pErr) {
        setError("Failed to load your learning roadmap.");
      }
    } finally {
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleItem = async (itemId, currentDone) => {
    if (!user?.id || !itemId) return;

    try {
      setTogglingId(itemId);
      await api.patch(`/roadmaps/student/${user.id}/item/${itemId}`, {
        done: !currentDone,
      });

      // Update state locally
      setRoadmap((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, done: !currentDone } : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle roadmap item:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const toggleEnroll = (title) => {
    setPrograms((prev) =>
      prev.map((p) => (p.title === title ? { ...p, enrolled: !p.enrolled } : p))
    );
  };

  const completedSteps = roadmap.filter((r) => r.done).length;
  const progressPercent =
    roadmap.length > 0 ? Math.round((completedSteps / roadmap.length) * 100) : 0;

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Learning Programs" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-extrabold text-[#1E1B33]">Learning & AI Roadmaps</h2>
            <span className="text-xs text-muted font-medium">
              Targeted Skill Elevation
            </span>
          </div>
          <p className="text-muted text-xs md:text-sm mb-6">
            Track your AI-generated milestone roadmap and enroll in recommended learning modules.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* AI Roadmap Section */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    Personalized AI Eligibility Roadmap
                  </h3>
                  <p className="text-xs text-muted">
                    Synthesized by Google Gemini AI based on detected skill gaps.
                  </p>
                </div>
              </div>

              {roadmap.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    {completedSteps} of {roadmap.length} Milestones Completed ({progressPercent}%)
                  </span>
                </div>
              )}
            </div>

            {loadingRoadmap ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading roadmap milestones...</p>
              </div>
            ) : roadmap.length === 0 ? (
              <div className="py-10 text-center text-muted border border-dashed border-slate-200 rounded-xl p-6">
                <Sparkles className="mx-auto mb-2 text-primary/60" size={28} />
                <p className="font-semibold text-sm text-[#1E1B33]">
                  No active learning roadmap found
                </p>
                <p className="text-xs mt-1 max-w-sm mx-auto mb-4">
                  Find an opportunity in the Opportunities portal and click "AI Roadmap" to generate a step-by-step preparation plan!
                </p>
                <Link
                  to="/student/opportunities"
                  className="btn-primary !px-4 !py-2 text-xs inline-flex items-center gap-1.5"
                >
                  Explore Opportunities <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-2">
                {roadmap.map((step, idx) => (
                  <div
                    key={step._id || idx}
                    onClick={() => handleToggleItem(step._id, step.done)}
                    className="cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-[#1E1B3B]/80 rounded-xl p-2.5 transition border border-transparent hover:border-slate-200 dark:hover:border-[#2E2A52]"
                  >
                    <RoadmapStep
                      step={idx + 1}
                      title={step.title}
                      description={step.description}
                      done={step.done}
                      last={idx === roadmap.length - 1}
                      youtubeVideoId={step.youtubeVideoId}
                      youtubeTitle={step.youtubeTitle}
                      youtubeChannel={step.youtubeChannel}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Learning Courses */}
          <h3 className="font-bold text-base text-[#1E1B33] dark:text-[#F3F4F6] mb-3">
            Recommended Skill Programs
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <div key={p.title} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33] dark:text-[#F3F4F6]">{p.title}</p>
                    <p className="text-xs text-muted dark:text-[#9CA3AF] mt-0.5">{p.provider}</p>
                  </div>
                  {p.enrolled && <CheckCircle2 size={18} className="text-green shrink-0" />}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted dark:text-[#9CA3AF] mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 size={13} /> {p.level}
                  </span>
                </div>

                <button
                  onClick={() => toggleEnroll(p.title)}
                  className={
                    p.enrolled
                      ? "btn-ghost !px-4 !py-2 text-xs w-full justify-center !bg-slate-100 dark:!bg-[#1E1B3B] !border-slate-200 dark:!border-[#2E2A52] !text-emerald-700 dark:!text-emerald-300 font-bold"
                      : "btn-primary !px-4 !py-2 text-xs w-full justify-center"
                  }
                >
                  {p.enrolled ? "Enrolled ✓" : "Enroll Now"}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}