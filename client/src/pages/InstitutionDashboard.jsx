import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Handshake,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  TrendingUp,
  Award,
  Building,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { institutionData as d } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

export const institutionItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/institution" },
  { label: "Students", icon: Users, href: "/institution/students" },
  { label: "Faculty", icon: GraduationCap, href: "/institution/faculty" },
  { label: "Collaborations", icon: Handshake, href: "/institution/collaborations" },
  { label: "Learning Programs", icon: BookOpen, href: "/institution/learning" },
  { label: "Reports", icon: BarChart3, href: "/institution/reports" },
  { label: "Settings", icon: Settings, href: "/institution/settings" },
];

const statusStyle = {
  Active: "bg-greenSoft text-green",
  Upcoming: "bg-amberSoft text-amber",
  Completed: "bg-bg text-muted",
};

// NBA Departmental Skill Gap Reduction Trend over Semesters (%)
const nbaSkillGapTrend = [
  { term: "Sem 1", CSE: 42, ECE: 48, MECH: 54, IT: 40 },
  { term: "Sem 2", CSE: 35, ECE: 41, MECH: 46, IT: 33 },
  { term: "Sem 3", CSE: 28, ECE: 34, MECH: 39, IT: 26 },
  { term: "Sem 4", CSE: 22, ECE: 28, MECH: 31, IT: 20 },
  { term: "Sem 5", CSE: 16, ECE: 21, MECH: 24, IT: 14 },
  { term: "Sem 6", CSE: 11, ECE: 15, MECH: 18, IT: 9 },
];

// NAAC Outcome-Based Education (OBE) Course Outcome (CO) to Program Outcome (PO) Attainment
const naacObeAttainment = [
  { outcome: "PO1 (Engg Knowledge)", target: 80, actual: 86 },
  { outcome: "PO2 (Problem Analysis)", target: 75, actual: 82 },
  { outcome: "PO3 (Design/Dev)", target: 75, actual: 88 },
  { outcome: "PO4 (Research & ML)", target: 70, actual: 78 },
  { outcome: "PO5 (Modern Tools)", target: 80, actual: 91 },
  { outcome: "PO9 (Individual/Team)", target: 85, actual: 89 },
];

// NIRF Placement Readiness vs Corporate MoUs
const nirfReadinessData = [
  { branch: "Computer Science", eligible: 94, placed: 88, activeMoUs: 14 },
  { branch: "Information Tech", eligible: 91, placed: 85, activeMoUs: 11 },
  { branch: "Electronics (ECE)", eligible: 82, placed: 74, activeMoUs: 9 },
  { branch: "Mechanical Engg", eligible: 76, placed: 68, activeMoUs: 7 },
  { branch: "Civil Engineering", eligible: 70, placed: 62, activeMoUs: 5 },
];

export default function InstitutionDashboard() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || d.name;

  return (
    <div className="flex bg-bg min-h-screen text-[#1E1B33] dark:text-[#F3F4F6]">
      <Sidebar
        brand={displayName}
        subtitle="Institution"
        items={institutionItems}
        active="Dashboard"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search students, accreditation metrics, reports..." />
        <div className="p-6 md:p-8 flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#1E1B33] dark:text-white">
                  Institutional Skill-Health & Accreditation
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                  <ShieldCheck size={12} /> NAAC 'A++' & NBA Tier-1 Ready
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted dark:text-gray-400">
                Continuous OBE CO-PO attainment analytics, departmental skill gap reductions, and NIRF graduate outcomes.
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {d.stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Accreditation Matrix Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  NAAC OBE Attainment
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-white/5 dark:text-indigo-300">
                  Criterion 2.6
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">85.6%</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight size={13} /> +6.2% vs target
                </span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Course Outcome (CO) to Program Outcome (PO) mapping index across all accredited departments.
              </p>
            </div>

            <div className="card p-4 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  NBA Skill-Gap Deficit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-white/5 dark:text-purple-300">
                  Criterion 4.1
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">13.2%</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight size={13} /> -28.8% Deficit reduction
                </span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Measured industry competency gap based on live company project assessments.
              </p>
            </div>

            <div className="card p-4 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  NIRF Placement & MoUs
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-white/5 dark:text-emerald-300">
                  Graduation Outcome
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">46 Active</span>
                <span className="text-xs text-indigo-600 font-bold">
                  Corporate MoUs
                </span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                92% final-year students pre-verified by AI Antara assessments for campus hiring.
              </p>
            </div>
          </div>

          {/* Middle Charts: NBA Trend & NAAC OBE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: NBA Departmental Skill Gap Reduction */}
            <div className="card p-5 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B33] dark:text-white flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-primary" />
                    NBA Skill-Gap Reduction Trend (Sem 1 - 6)
                  </h3>
                  <p className="text-xs text-muted">Deficit drops as students complete live industry projects</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300">
                  Lower is Better (%)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={nbaSkillGapTrend} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="eceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="term" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 60]} />
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Area type="monotone" dataKey="CSE" stroke="#4F46E5" fillOpacity={1} fill="url(#cseGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="ECE" stroke="#8B5CF6" fillOpacity={1} fill="url(#eceGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="MECH" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="IT" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: NAAC OBE CO-PO Attainment */}
            <div className="card p-5 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B33] dark:text-white flex items-center gap-1.5">
                    <Award size={16} className="text-purple-600" />
                    NAAC OBE CO-PO Attainment vs Targets
                  </h3>
                  <p className="text-xs text-muted">Program Outcomes measured against national engineering rubrics</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Target Met
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={naacObeAttainment} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="outcome" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", marginTop: "15px" }} />
                    <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="NBA Target %" />
                    <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Actual Attainment %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row: NIRF Placement Readiness & Collaborations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* NIRF Readiness Matrix */}
            <div className="lg:col-span-2 card p-5 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B33] dark:text-white flex items-center gap-1.5">
                    <Building size={16} className="text-emerald-600" />
                    NIRF Departmental Placement Readiness & Industry MoUs
                  </h3>
                  <p className="text-xs text-muted">Correlating campus hiring conversion to active industry co-guidance</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#ECEBF5] dark:border-white/10 text-muted font-bold uppercase tracking-wider">
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5">Pre-Verified Readiness</th>
                      <th className="py-2.5">Placement Conversion</th>
                      <th className="py-2.5">Active Corporate MoUs</th>
                      <th className="py-2.5">Accreditation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEBF5] dark:divide-white/5 font-medium">
                    {nirfReadinessData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                        <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{row.branch}</td>
                        <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.eligible}%
                        </td>
                        <td className="py-3 font-mono text-emerald-600 font-bold">
                          {row.placed}%
                        </td>
                        <td className="py-3">
                          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                            {row.activeMoUs} MoUs
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="status-pill bg-greenSoft text-green font-semibold text-[10px]">
                            NBA Tier-1 Validated
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Corporate Collaborations */}
            <div className="card p-5 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[#1E1B33] dark:text-white">Active Industry MoUs</h3>
                <a href="/institution/collaborations" className="text-xs text-primary font-semibold hover:underline">
                  View All
                </a>
              </div>
              <ul className="divide-y divide-[#ECEBF5] dark:divide-white/5">
                {d.collaborations.map((c) => (
                  <li key={c.name} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-[#1E1B33] dark:text-white">{c.name}</p>
                      <p className="text-[11px] text-muted">{c.type}</p>
                    </div>
                    <span className={`status-pill ${statusStyle[c.status]} text-[10px]`}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}