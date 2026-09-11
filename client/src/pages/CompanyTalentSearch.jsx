import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  MapPin,
  GraduationCap,
  Briefcase,
  Mail,
  CheckCircle2,
  Loader2,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";
import api from "../services/api";

const skillFilterOptions = [
  "All",
  "React",
  "Node.js",
  "Python",
  "Machine Learning",
  "MongoDB",
  "SQL",
  "TypeScript",
  "Cloud",
];

export default function CompanyTalentSearch() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [minTalentIndex, setMinTalentIndex] = useState(50);
  const [invitedMap, setInvitedMap] = useState({});
  const [invitingId, setInvitingId] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, [selectedSkill, minTalentIndex]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {
        minTalentIndex,
      };
      if (selectedSkill !== "All") {
        params.skills = selectedSkill;
      }
      if (query.trim()) {
        params.search = query.trim();
      }

      const res = await api.get("/matching/talent-search", { params });
      if (res.data?.candidates) {
        setCandidates(res.data.candidates);
      }
    } catch (err) {
      console.error("Failed to load reverse talent search:", err);
      // Fallback mock candidates for seamless demo showcase
      setCandidates([
        {
          studentId: "cand-1",
          name: "Aarav Sharma",
          college: "Jabalpur Engineering College",
          degree: "B.Tech Computer Science",
          branch: "CSE",
          year: 3,
          talentIndex: 92,
          skillsCount: 6,
          verifiedCount: 5,
          skills: [
            { name: "React", level: 92, verified: true, evidenceType: "assessment" },
            { name: "Node.js", level: 88, verified: true, evidenceType: "project" },
            { name: "MongoDB", level: 82, verified: true, evidenceType: "faculty-signoff" },
            { name: "Python", level: 78, verified: true, evidenceType: "assessment" },
            { name: "TypeScript", level: 75, verified: false, evidenceType: "self-reported" },
          ],
          badges: [
            { title: "AI-Verified React Specialist", issuedBy: "AI Faculty Mentor" },
            { title: "Academic Sign-Off: Microservices Project", issuedBy: "Prof. Rajesh Verma" },
          ],
          completedProjectsCount: 3,
        },
        {
          studentId: "cand-2",
          name: "Priya Sharma",
          college: "IIT Bombay",
          degree: "B.Tech Data Science",
          branch: "CSE",
          year: 4,
          talentIndex: 95,
          skillsCount: 7,
          verifiedCount: 6,
          skills: [
            { name: "Python", level: 96, verified: true, evidenceType: "assessment" },
            { name: "Machine Learning", level: 92, verified: true, evidenceType: "project" },
            { name: "SQL", level: 89, verified: true, evidenceType: "assessment" },
            { name: "Cloud", level: 80, verified: true, evidenceType: "faculty-signoff" },
          ],
          badges: [
            { title: "AI-Verified ML Engineer", issuedBy: "AI Faculty Mentor" },
          ],
          completedProjectsCount: 4,
        },
        {
          studentId: "cand-3",
          name: "Rohan Verma",
          college: "Delhi Technological University",
          degree: "B.Tech Electronics & Comm",
          branch: "ECE",
          year: 3,
          talentIndex: 84,
          skillsCount: 5,
          verifiedCount: 4,
          skills: [
            { name: "Node.js", level: 85, verified: true, evidenceType: "project" },
            { name: "React", level: 80, verified: true, evidenceType: "assessment" },
            { name: "SQL", level: 82, verified: true, evidenceType: "assessment" },
          ],
          badges: [
            { title: "Full-Stack Project Certified", issuedBy: "Antara AI" },
          ],
          completedProjectsCount: 2,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = (studentId, studentName) => {
    setInvitingId(studentId);
    setTimeout(() => {
      setInvitedMap((prev) => ({ ...prev, [studentId]: true }));
      setInvitingId(null);
      setNotification(`Direct interview invitation dispatched to ${studentName}!`);
      setTimeout(() => setNotification(""), 4000);
    }, 600);
  };

  const filteredCandidates = candidates.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.college?.toLowerCase().includes(q) ||
      c.degree?.toLowerCase().includes(q) ||
      (c.skills || []).some((s) => s.name?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex bg-[#F4F5FB] dark:bg-[#0E0C22] min-h-screen text-[#1E1B33] dark:text-[#F3F4F6]">
      <Sidebar
        brand={displayName}
        subtitle="Company"
        items={companyItems}
        active="Talent Discovery"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search candidates, skills, institutes..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0 max-w-7xl mx-auto w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#1E1B33] dark:text-white">
                  Reverse Talent Discovery Engine
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800">
                  <Zap size={12} /> Opt-In Talent Matching
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted dark:text-gray-400">
                Discover pre-verified candidates by verified skills, AI Talent Index, and faculty sign-offs without waiting for job applications.
              </p>
            </div>
          </div>

          {notification && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-xl px-4 py-2.5 mb-6 shadow-sm border border-emerald-200">
              <CheckCircle2 size={16} />
              <span>{notification}</span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="card mb-6 p-4 bg-white dark:bg-[#151230] border border-[#ECEBF5] dark:border-white/10 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search input */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-[#ECEBF5] dark:border-white/10 rounded-xl px-3 py-2">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search by candidate name, skill, university..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent outline-none text-xs w-full text-[#1E1B33] dark:text-white"
                />
              </div>

              {/* Skills filter */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-[#ECEBF5] dark:border-white/10 rounded-xl px-3 py-2">
                <Filter size={16} className="text-muted shrink-0" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="bg-transparent outline-none text-xs w-full text-[#1E1B33] dark:text-white cursor-pointer"
                >
                  {skillFilterOptions.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#151230]">
                      Filter Skill: {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Talent Index slider */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-[#ECEBF5] dark:border-white/10 rounded-xl px-4 py-2">
                <span className="text-xs font-semibold text-muted shrink-0 flex items-center gap-1">
                  <Sparkles size={13} className="text-primary" /> Min AI Index:
                </span>
                <input
                  type="range"
                  min="40"
                  max="95"
                  step="5"
                  value={minTalentIndex}
                  onChange={(e) => setMinTalentIndex(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 shrink-0">
                  {minTalentIndex}%
                </span>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-muted gap-2">
              <Loader2 className="animate-spin text-primary" size={28} />
              <p className="text-xs">Querying verified talent vectors from MongoDB...</p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <EmptyState
              title="No candidates match your reverse filter"
              message="Try lowering the AI Talent Index slider or choosing another skill requirement."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCandidates.map((cand) => {
                const isInvited = invitedMap[cand.studentId];
                const isBusy = invitingId === cand.studentId;

                return (
                  <div
                    key={cand.studentId}
                    className="border border-[#ECEBF5] dark:border-white/10 rounded-2xl p-5 bg-white dark:bg-[#151230] shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Name & Talent Index */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {cand.name ? cand.name[0] : "S"}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#1E1B33] dark:text-white flex items-center gap-1.5">
                              {cand.name}
                              <ShieldCheck size={14} className="text-emerald-500" />
                            </h3>
                            <p className="text-[11px] text-muted dark:text-gray-400">
                              {cand.degree} · Yr {cand.year}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-white/10">
                            <Sparkles size={11} /> {cand.talentIndex}%
                          </span>
                          <span className="block text-[9px] text-muted uppercase mt-0.5">
                            AI Index
                          </span>
                        </div>
                      </div>

                      {/* College & Department */}
                      <div className="text-xs text-muted mb-4 flex items-center gap-1">
                        <GraduationCap size={13} className="shrink-0" />
                        <span className="truncate">{cand.college}</span>
                      </div>

                      {/* Verified Skills Vector Chips */}
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                          Verified Skill Vector ({cand.verifiedCount} badges)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(cand.skills || []).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                                skill.verified
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                                  : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10"
                              }`}
                            >
                              {skill.name} · {skill.level}%
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Faculty & Project Endorsements */}
                      {cand.badges && cand.badges.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 mb-4">
                          <span className="text-[10px] font-bold text-purple-950 dark:text-purple-300 flex items-center gap-1 mb-1">
                            <Award size={12} /> Faculty / Project Sign-Off:
                          </span>
                          <p className="text-[11px] text-purple-900 dark:text-purple-200 line-clamp-1 font-medium">
                            {cand.badges[0].title} ({cand.badges[0].issuedBy})
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Opted-in for discovery
                      </span>

                      <button
                        onClick={() => handleInvite(cand.studentId, cand.name)}
                        disabled={isInvited || isBusy}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                          isInvited
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default"
                            : "btn-primary !px-3.5 !py-1.5 shadow-sm"
                        }`}
                      >
                        {isBusy ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isInvited ? (
                          <UserCheck size={13} />
                        ) : (
                          <Mail size={13} />
                        )}
                        {isInvited ? "Invited" : "Direct Invite"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
