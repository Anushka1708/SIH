// import { LayoutDashboard, BookOpen, Users, ClipboardList, Handshake, User, Settings } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import StatCard from "../components/StatCard";
// import { facultyData as d } from "../data/mockData";
// import { getCurrentUser } from "../utils/auth";

// const items = [
//   { label: "Dashboard", icon: LayoutDashboard, href: "/faculty" },
//   { label: "Courses", icon: BookOpen, href: "/faculty/courses" },
//   { label: "Students", icon: Users, href: "/faculty/students" },
//   { label: "Assessments", icon: ClipboardList, href: "/faculty/assessments" },
//   { label: "Mentorship", icon: Handshake, href: "/faculty/mentorship" },
//   { label: "Profile", icon: User, href: "/faculty/profile" },
//   { label: "Settings", icon: Settings, href: "/faculty/settings" },
// ];

// export default function FacultyDashboard() {
//   const user = getCurrentUser();
//   const displayName = user?.name || d.name;
//   const p = d.performance;
//   const circumference = 2 * Math.PI * 42;
//   const offset = circumference - (p.score / 100) * circumference;

//   return (
//     <div className="flex bg-bg min-h-screen">
//       <Sidebar brand={displayName} subtitle="Faculty" items={items} active="Dashboard" />
//       <div className="flex-1">
//         <Topbar placeholder="Search students, courses..." />
//         <div className="p-6">
//           <h2 className="text-xl font-extrabold mb-1">Welcome, {displayName}!</h2>
//           <p className="text-muted text-sm mb-6">Guide. Mentor. Build future leaders.</p>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {d.stats.map((s) => <StatCard key={s.label} {...s} />)}
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="card">
//               <div className="flex justify-between items-center mb-1">
//                 <p className="font-semibold text-[#1E1B33] text-sm">Upcoming Sessions</p>
//                 <a href="#" className="text-xs text-primary font-semibold">View All</a>
//               </div>
//               <ul>
//                 {d.sessions.map((s) => (
//                   <li key={s.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
//                     <div>
//                       <p className="text-sm font-semibold text-[#1E1B33]">{s.title}</p>
//                       <p className="text-xs text-muted">{s.time}</p>
//                     </div>
//                     <button className="btn-primary !px-4 !py-2 text-xs">Join</button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="card flex items-center gap-6">
//               <svg width="110" height="110" viewBox="0 0 100 100">
//                 <circle cx="50" cy="50" r="42" fill="none" stroke="#ECEBF5" strokeWidth="8" />
//                 <circle cx="50" cy="50" r="42" fill="none" stroke="#4F46E5" strokeWidth="8"
//                   strokeDasharray={circumference} strokeDashoffset={offset}
//                   strokeLinecap="round" transform="rotate(-90 50 50)" />
//                 <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1E1B33">{p.score}%</text>
//               </svg>
//               <div>
//                 <p className="text-sm font-semibold text-[#1E1B33] mb-2">Student Performance</p>
//                 <ul className="text-xs text-muted flex flex-col gap-1.5 font-mono">
//                   <li>🟢 Excellent — {p.excellent}%</li>
//                   <li>🔵 Good — {p.good}%</li>
//                   <li>🟡 Needs Improvement — {p.needsImprovement}%</li>
//                   <li>🔴 Poor — {p.poor}%</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Handshake,
  User,
  Settings,
  Sparkles,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  Activity,
  Award,
  Zap,
  FolderKanban,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { facultyData as defaultData } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";

export const facultyItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/faculty" },
  { label: "Live Industry Projects", icon: FolderKanban, href: "/faculty/projects" },
  { label: "Assessments", icon: ClipboardList, href: "/faculty/assessments" },
  { label: "Upskilling & AI Quizzes", icon: Sparkles, href: "/faculty/upskilling" },
  { label: "Academic CV Analyzer", icon: FileText, href: "/faculty/resume" },
  { label: "Courses", icon: BookOpen, href: "/faculty/courses" },
  { label: "Students", icon: Users, href: "/faculty/students" },
  { label: "Mentorship", icon: Handshake, href: "/faculty/mentorship" },
  { label: "Profile", icon: User, href: "/faculty/profile" },
  { label: "Settings", icon: Settings, href: "/faculty/settings" },
];

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get("/faculty/dashboard");
        if (res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn("Using fallback faculty dashboard state:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const d = dashboardData || defaultData;
  const displayName = user?.name || d.facultyName || d.name || "Dr. Rajesh Verma";
  const designation = user?.designation || d.designation || "Placement Head & Senior Professor";
  const assessments = d.assessments || [];

  // Assessment statistics
  const totalTestsCreated = assessments.length || 3;
  const activeQuizzes = assessments.filter((a) => a.status === "Active").length || 3;
  const pendingEvaluations = assessments.reduce((acc, curr) => acc + (curr.pendingCount || 0), 0) || 4;
  const studentCompletionRate = d.stats?.find((s) => s.label.includes("Completion"))?.value || "92%";

  const p = d.performance || { score: 84, excellent: 42, good: 38, needsImprovement: 15, poor: 5 };
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (p.score / 100) * circumference;

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search assessments, students, courses..." />
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2E2A52] gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] dark:text-[#F3F4F6]">
                  Welcome, {displayName}!
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  AI Evaluator Online
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm">
                {designation} · Jabalpur Engineering College (NAAC A++)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/faculty/assessments")}
                className="btn-primary !px-4 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>+ Create Assessment</span>
              </button>
            </div>
          </div>

          {/* 4 Clickable Assessment Metric Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Assessment Telemetry (Click to manage)
              </span>
              <button
                onClick={() => navigate("/faculty/assessments")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Manager</span> <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<ClipboardList size={18} />}
                label="Total Tests Created"
                value={totalTestsCreated}
                change="+3 this month"
                color="primary"
                onClick={() => navigate("/faculty/assessments")}
              />
              <StatCard
                icon={<Activity size={18} />}
                label="Active Quizzes"
                value={activeQuizzes}
                change="Live & Available"
                color="green"
                onClick={() => navigate("/faculty/assessments")}
              />
              <StatCard
                icon={<TrendingUp size={18} />}
                label="Student Completion Rate"
                value={studentCompletionRate}
                change="+4% vs last term"
                color="primary"
                onClick={() => navigate("/faculty/assessments")}
              />
              <StatCard
                icon={<AlertCircle size={18} />}
                label="Pending Evaluations"
                value={pendingEvaluations}
                change={pendingEvaluations > 0 ? "Requires review" : "All graded"}
                color={pendingEvaluations > 0 ? "amber" : "green"}
                onClick={() => navigate("/faculty/assessments")}
              />
            </div>
          </div>

          {/* Quick Hub Portals for Upskilling & CV Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Upskilling Card */}
            <div
              onClick={() => navigate("/faculty/upskilling")}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#1E1B3B] to-[#130F2E] border border-indigo-500/30 text-white shadow-sm hover:shadow-md hover:border-indigo-400/50 transition cursor-pointer flex items-start justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                    Faculty Upskilling Engine
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
                  Professional Educator AI Quizzes & Badges
                </h4>
                <p className="text-xs text-indigo-200/80 max-w-sm">
                  Complete accredited pedagogical modules (Active Learning, Generative AI in Teaching, ABET Standards) to earn verified digital credentials.
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <span>Take Educator Quiz</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shrink-0">
                4 Modules
              </span>
            </div>

            {/* Academic CV Analyzer Card */}
            <div
              onClick={() => navigate("/faculty/resume")}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0F2327] to-[#0A1619] border border-emerald-500/30 text-white shadow-sm hover:shadow-md hover:border-emerald-400/50 transition cursor-pointer flex items-start justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                    AI Academic CV Analyzer
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-200 transition">
                  Accreditation & Research Dossier Review
                </h4>
                <p className="text-xs text-emerald-200/80 max-w-sm">
                  Upload your CV to extract Scopus/IEEE publications, teaching experience, and receive AI-backed recommendations for research grants and promotions.
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <span>Audit Academic CV</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 shrink-0">
                Instant Audit
              </span>
            </div>
          </div>

          {/* Active Assessments & Student Performance Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Active Quizzes Summary Card */}
            <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-[#E2E8F0] dark:border-[#2E2A52] shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-[#2E2A52]">
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-primary" />
                  <p className="font-bold text-[#1E1B33] dark:text-[#F3F4F6] text-sm">Active Assessments</p>
                </div>
                <button
                  onClick={() => navigate("/faculty/assessments")}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Manage All
                </button>
              </div>

              {assessments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No active assessments yet. Click "+ Create Assessment" above to launch one.
                </div>
              ) : (
                <ul className="space-y-3">
                  {assessments.slice(0, 3).map((a, idx) => (
                    <li
                      key={a._id || idx}
                      onClick={() => navigate("/faculty/assessments")}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E1B3B]/60 hover:bg-indigo-50/50 dark:hover:bg-[#1E1B3B] border border-slate-100 dark:border-transparent transition flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#1E1B33] dark:text-[#F3F4F6] group-hover:text-primary transition">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {a.course} · {a.submissionsCount || 0} Submissions
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          (a.pendingCount || 0) > 0
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {(a.pendingCount || 0) > 0 ? `${a.pendingCount} Pending Review` : "All Graded"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Performance Analytics Gauge */}
            <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-[#E2E8F0] dark:border-[#2E2A52] shadow-sm flex items-center gap-6">
              <svg width="110" height="110" viewBox="0 0 100 100" className="shrink-0">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ECEBF5" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="800"
                  fill="currentColor"
                  className="text-[#1E1B33] dark:text-[#F3F4F6]"
                >
                  {p.score}%
                </text>
              </svg>
              <div>
                <p className="text-sm font-bold text-[#1E1B33] dark:text-[#F3F4F6] mb-2">
                  Student Competency Index
                </p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1.5 font-medium">
                  <li>🟢 High Proficiency — {p.excellent}%</li>
                  <li>🔵 Competent — {p.good}%</li>
                  <li>🟡 In Progress — {p.needsImprovement}%</li>
                  <li>🔴 Needs Remediation — {p.poor}%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}