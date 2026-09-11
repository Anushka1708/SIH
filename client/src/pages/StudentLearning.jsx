import { useState, useEffect, useRef } from "react";
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
  ArrowDown,
  Download,
  Video,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { studentData } from "../data/mockData";
import api from "../services/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Skill Passport", icon: Award, href: "/student/passport" },
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
  const [exportingPDF, setExportingPDF] = useState(false);
  const [openVideoStep, setOpenVideoStep] = useState(null);
  const [error, setError] = useState("");
  const flowchartRef = useRef(null);

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

  const handleDownloadPDF = async () => {
    const el = flowchartRef.current;
    if (!el) return;

    try {
      setExportingPDF(true);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${(user?.name || "Student").replace(/\s+/g, "_")}_AI_Roadmap.pdf`);
    } catch (err) {
      console.error("Failed to export roadmap PDF:", err);
    } finally {
      setExportingPDF(false);
    }
  };

  const completedSteps = roadmap.filter((r) => r.done).length;
  const progressPercent =
    roadmap.length > 0 ? Math.round((completedSteps / roadmap.length) * 100) : 0;

  return (
    <div className="flex bg-[#F4F5FB] dark:bg-[#0B081E] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Learning Programs" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-[#F3F4F6] tracking-tight">
                Learning Programs & AI Roadmaps
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5">
                Track your structured milestone flowchart, watch recommended masterclasses, and export your roadmap.
              </p>
            </div>
            {roadmap.length > 0 && (
              <button
                onClick={handleDownloadPDF}
                disabled={exportingPDF}
                className="btn-primary !px-4 !py-2 text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                title="Download Visual Roadmap as PDF"
              >
                {exportingPDF ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span>{exportingPDF ? "Generating PDF..." : "Download Roadmap PDF"}</span>
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-xl px-4 py-2.5 my-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Visual AI Flowchart Roadmap Section */}
          <div
            ref={flowchartRef}
            id="roadmap-flowchart-container"
            className="bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 mt-4"
          >
            {/* Roadmap Top Header & Telemetry */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E2E8F0] dark:border-[#2E2A52] flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F3F4F6]">
                      Adaptive Competency Elevation Flowchart
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      Step-by-Step Pathway
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Synthesized by Antara AI based on detected competency gap vectors.
                  </p>
                </div>
              </div>

              {roadmap.length > 0 && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1E1B3B] px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#2E2A52]">
                  <div className="text-right">
                    <p className="text-xs font-black text-[#0F172A] dark:text-[#F3F4F6]">
                      {completedSteps} / {roadmap.length} Milestones
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {progressPercent}% Eligibility Achieved
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#130F2E] border border-slate-200 dark:border-[#2E2A52] flex items-center justify-center font-black text-xs text-primary shadow-xs">
                    {progressPercent}%
                  </div>
                </div>
              )}
            </div>

            {/* Flowchart Content */}
            {loadingRoadmap ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="animate-spin text-primary" size={28} />
                <p className="text-xs font-semibold">Synthesizing visual learning flowchart...</p>
              </div>
            ) : roadmap.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-[#2E2A52] rounded-2xl p-8">
                <Sparkles className="mx-auto mb-3 text-primary" size={32} />
                <p className="font-bold text-sm text-[#0F172A] dark:text-[#F3F4F6]">
                  No active learning roadmap generated yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto mb-5">
                  Browse opportunities in the Opportunities portal and click "AI Roadmap" on any job or internship card to generate your custom flowchart!
                </p>
                <Link
                  to="/student/opportunities"
                  className="btn-primary !px-5 !py-2.5 text-xs font-bold inline-flex items-center gap-2"
                >
                  Explore Target Opportunities <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              /* Step-by-Step Connected Flowchart Visualizer */
              <div className="relative py-2 max-w-2xl mx-auto">
                {roadmap.map((step, idx) => {
                  const isDone = step.done;
                  const isLast = idx === roadmap.length - 1;
                  const stepNumber = String(idx + 1).padStart(2, "0");
                  const effectiveVideoId =
                    step.youtubeVideoId ||
                    (step.title?.toLowerCase().includes("docker")
                      ? "fqMOX6JJhGo"
                      : step.title?.toLowerCase().includes("aws") || step.title?.toLowerCase().includes("cloud")
                      ? "2LaAJq1lB1Q"
                      : step.title?.toLowerCase().includes("system")
                      ? "m8Icp_Cid5o"
                      : step.title?.toLowerCase().includes("node")
                      ? "Oe421EPjeBE"
                      : "bMknfKXIFA8");

                  const isVideoOpen = openVideoStep === idx;

                  return (
                    <div key={step._id || idx} className="relative">
                      {/* Milestone Flowchart Node Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`p-5 rounded-2xl border transition-all relative ${
                          isDone
                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm"
                            : "bg-white dark:bg-[#1E1B3B] border-[#E2E8F0] dark:border-[#2E2A52] hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                        }`}
                      >
                        {/* Node Header */}
                        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            {/* Step Badge */}
                            <span
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                                isDone
                                  ? "bg-emerald-500 text-white"
                                  : "bg-indigo-600 text-white"
                              }`}
                            >
                              {isDone ? "✓" : stepNumber}
                            </span>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                                  {step.title}
                                </h4>
                                {isDone ? (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                    Completed ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    Stage {idx + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Timeline / Duration Badge & Actions */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#130F2E] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2E2A52] flex items-center gap-1">
                              <Clock size={11} /> Est. 1 - 2 Weeks
                            </span>

                            <button
                              onClick={() => handleToggleItem(step._id, step.done)}
                              disabled={togglingId === step._id}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                                isDone
                                  ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }`}
                              title={isDone ? "Mark as in progress" : "Mark as completed"}
                            >
                              {togglingId === step._id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : isDone ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <Circle size={12} />
                              )}
                              <span>{isDone ? "Completed" : "Mark Done"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-10.5">
                          {step.description}
                        </p>

                        {/* Masterclass Video Toggle Button */}
                        <div className="mt-3.5 pl-10.5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setOpenVideoStep(isVideoOpen ? null : idx)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                              isVideoOpen
                                ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                                : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100"
                            }`}
                          >
                            <Video size={13} />
                            <span>{isVideoOpen ? "Hide Masterclass" : "Watch Video Masterclass"}</span>
                            {isVideoOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>

                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Sparkles size={11} className="text-amber-400" /> Curated Classroom Video
                          </span>
                        </div>

                        {/* Inline YouTube Video Player Accordion */}
                        {isVideoOpen && effectiveVideoId && (
                          <div className="mt-3.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-white animate-fadeIn">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="font-bold text-slate-100 truncate text-[11.5px]">
                                  {step.youtubeTitle || `${step.title} - Full Interactive Course`}
                                </span>
                              </div>
                              <span className="text-[10px] text-indigo-300 font-semibold shrink-0 ml-2 bg-white/10 px-2 py-0.5 rounded">
                                {step.youtubeChannel || "Antara EdTech"}
                              </span>
                            </div>

                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${effectiveVideoId}?autoplay=1&rel=0`}
                                title={step.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Play size={11} className="text-emerald-400" /> Interactive Antara Classroom
                              </span>
                              <a
                                href={`https://www.youtube.com/watch?v=${effectiveVideoId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-300 hover:text-white flex items-center gap-1 hover:underline"
                              >
                                Open in YouTube <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Visual Flowchart Connected Node Arrow */}
                      {!isLast && (
                        <div className="flex flex-col items-center my-1.5">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-indigo-300 dark:from-indigo-400 dark:to-indigo-600" />
                          <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-primary shadow-xs">
                            <ArrowDown size={13} className="animate-bounce" />
                          </div>
                          <div className="w-0.5 h-2 bg-indigo-300 dark:bg-indigo-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Learning Courses */}
          <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F3F4F6] mb-3">
            Recommended Skill Certification Programs
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <div
                key={p.title}
                className="bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-2xl p-5 shadow-sm hover:border-indigo-200 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">{p.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.provider}</p>
                  </div>
                  {p.enrolled && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={13} /> {p.duration}
                  </span>
                  <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px] font-mono">
                    <BarChart2 size={13} /> {p.level}
                  </span>
                  {p.accreditation && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {p.accreditation}
                    </span>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 ml-auto font-semibold"
                    >
                      Official Catalog <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => toggleEnroll(p.title)}
                  className={
                    p.enrolled
                      ? "btn-ghost !px-4 !py-2 text-xs w-full justify-center !bg-slate-100 dark:!bg-[#1E1B3B] !border-slate-200 dark:!border-[#2E2A52] !text-emerald-700 dark:!text-emerald-300 font-bold"
                      : "btn-primary !px-4 !py-2 text-xs w-full justify-center font-bold"
                  }
                >
                  {p.enrolled ? "Enrolled ✓" : "Enroll in Program"}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}