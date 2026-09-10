import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  Search,
  MapPin,
  Banknote,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import ExplainableMatchModal from "../components/ExplainableMatchModal";
import { getCurrentUser } from "../utils/auth";
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

const types = ["All", "Internship", "Job", "Project"];

export default function StudentOpportunities() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const displayName = user?.name || "Student";

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [opportunities, setOpportunities] = useState([]);
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [activeExplainableMatch, setActiveExplainableMatch] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (type !== "All") {
        params.type = type.toLowerCase();
      }
      if (query.trim()) {
        params.search = query.trim();
      }

      const res = await api.get("/opportunities", { params });
      const opps = res.data.opportunities || [];
      setOpportunities(opps);

      // Fetch match scores concurrently for these opportunities
      if (user?.id && opps.length > 0) {
        opps.forEach(async (o) => {
          try {
            const matchRes = await api.get(`/matching/opportunity/${o._id}/student/${user.id}`);
            if (matchRes.data) {
              setMatches((prev) => ({ ...prev, [o._id]: matchRes.data }));
            }
          } catch (mErr) {
            // Non-blocking match fetch
          }
        });
      }
    } catch (err) {
      console.error("Failed to load opportunities:", err);
      setError(err.response?.data?.message || "Failed to load opportunities from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 300);

    return () => clearTimeout(timer);
  }, [type, query]);

  const handleApply = async (oppId) => {
    try {
      setApplyingId(oppId);
      setError("");
      setSuccess("");

      const res = await api.post(`/opportunities/${oppId}/apply`);
      setSuccess(res.data.message || "Application submitted successfully!");
      setTimeout(() => setSuccess(""), 4000);

      fetchOpportunities();
    } catch (err) {
      console.error("Application failed:", err);
      setError(err.response?.data?.message || "Failed to apply for this opportunity.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setApplyingId(null);
    }
  };

  const handleGenerateRoadmap = async (oppId) => {
    try {
      setGeneratingId(oppId);
      setError("");
      setSuccess("");

      const res = await api.post("/roadmaps/generate", {
        studentId: user?.id,
        opportunityId: oppId,
      });

      setSuccess("AI Roadmap generated with SkillBridge AI! Redirecting to Learning Programs...");
      setTimeout(() => {
        navigate("/student/learning");
      }, 1500);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to generate AI roadmap.");
    } finally {
      setGeneratingId(null);
    }
  };

  const isAlreadyApplied = (opp) => {
    if (!opp.applicants || !user?.id) return false;
    return opp.applicants.some(
      (a) => (a.student?._id || a.student)?.toString() === user.id.toString()
    );
  };

  const getMatchScoreBadge = (score) => {
    if (score === undefined || score === null) return null;
    let badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    if (score >= 75) {
      badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (score >= 50) {
      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    }

    return (
      <span className={`border text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${badgeClass}`}>
        <Sparkles size={11} /> {score}% Match
      </span>
    );
  };

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Student" items={items} active="Opportunities" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-extrabold text-[#1E1B33]">Opportunities</h2>
            <span className="text-xs text-muted font-medium">
              AI Competency Matching Enabled
            </span>
          </div>
          <p className="text-muted text-xs md:text-sm mb-6">
            Browse internships, jobs and live projects with explainable match scores and AI roadmap generation.
          </p>

          {success && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <label className="flex items-center gap-2 bg-white border border-[#ECEBF5] rounded-xl px-3 py-2.5 flex-1">
              <Search size={16} className="text-muted" />
              <input
                className="outline-none text-sm w-full"
                placeholder="Search by role title, description, or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="flex gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${
                    type === t
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-[#ECEBF5] text-muted hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Fetching opportunities from server...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <EmptyState
                title="No opportunities found"
                message="Try adjusting your search query or role type filter."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {opportunities.map((o) => {
                  const applied = isAlreadyApplied(o);
                  const companyTitle =
                    o.company?.companyName || o.postedBy?.name || "Verified Partner";
                  const matchInfo = matches[o._id];

                  return (
                    <div
                      key={o._id}
                      className="border border-[#ECEBF5] rounded-xl2 p-5 hover:border-primary/30 transition bg-white"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-base font-bold text-[#1E1B33]">{o.title}</h3>
                            <span className="capitalize text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {o.type}
                            </span>
                            {matchInfo && getMatchScoreBadge(matchInfo.score)}
                          </div>
                          <p className="text-xs text-muted flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-slate-700">{companyTitle}</span>
                            {o.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {o.location}
                              </span>
                            )}
                            {o.stipend && (
                              <span className="flex items-center gap-1">
                                <Banknote size={12} /> {o.stipend}
                              </span>
                            )}
                            {o.applicationDeadline && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> Deadline:{" "}
                                {new Date(o.applicationDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleGenerateRoadmap(o._id)}
                            disabled={generatingId === o._id}
                            className="border border-indigo-300 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-60"
                          >
                            {generatingId === o._id ? (
                              <Loader2 size={13} className="animate-spin text-primary" />
                            ) : (
                              <Sparkles size={13} className="text-primary" />
                            )}
                            {generatingId === o._id ? "Generating..." : "AI Roadmap"}
                          </button>

                          {applied ? (
                            <span className="status-pill bg-greenSoft text-green font-semibold text-xs flex items-center gap-1 px-3 py-1.5">
                              <CheckCircle2 size={13} /> Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(o._id)}
                              disabled={applyingId === o._id}
                              className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5 disabled:opacity-60"
                            >
                              {applyingId === o._id && (
                                <Loader2 size={12} className="animate-spin" />
                              )}
                              {applyingId === o._id ? "Applying..." : "Apply Now"}
                            </button>
                          )}
                        </div>
                      </div>

                      {matchInfo && (
                        <div className="flex items-center justify-between gap-3 p-2.5 mb-3 rounded-xl border border-indigo-100 dark:border-white/10 bg-indigo-50/50 dark:bg-white/5 flex-wrap">
                          <p className="text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                            💡 <span className="font-bold">Match Reasoning:</span> {matchInfo.reasoning}
                          </p>
                          <button
                            onClick={() =>
                              setActiveExplainableMatch({
                                opportunityTitle: o.title,
                                companyName: companyTitle,
                                matchData: matchInfo,
                              })
                            }
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 underline flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Sparkles size={12} /> Why this match? (Explainable AI)
                          </button>
                        </div>
                      )}

                      {o.description && (
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                          {o.description}
                        </p>
                      )}

                      {o.requiredSkills && o.requiredSkills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
                          <span className="text-[11px] text-muted font-medium mr-1">
                            Required:
                          </span>
                          {o.requiredSkills.map((rs, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                            >
                              {rs.skill?.name || "Skill"} (min {rs.minLevel || 50}%)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Explainable AI Modal */}
      {activeExplainableMatch && (
        <ExplainableMatchModal
          isOpen={Boolean(activeExplainableMatch)}
          onClose={() => setActiveExplainableMatch(null)}
          opportunityTitle={activeExplainableMatch.opportunityTitle}
          companyName={activeExplainableMatch.companyName}
          matchData={activeExplainableMatch.matchData}
          onAddToRoadmap={async (gap) => {
            try {
              await api.post("/roadmaps/generate", {
                studentId: user?.id,
                targetRole: gap.skillName,
              });
            } catch (err) {
              console.warn("Roadmap update notice:", err);
            }
          }}
        />
      )}
    </div>
  );
}