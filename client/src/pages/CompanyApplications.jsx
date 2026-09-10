import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";
import api from "../services/api";

const statusStyles = {
  applied: { label: "Applied", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  reviewing: { label: "Under Review", class: "bg-sky-50 text-sky-700 border-sky-200" },
  shortlisted: { label: "Shortlisted", class: "bg-amber-50 text-amber-700 border-amber-200" },
  interview: { label: "Interviewing", class: "bg-purple-50 text-purple-700 border-purple-200" },
  accepted: { label: "Accepted / Hired", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", class: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function CompanyApplications() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingCandidateId, setUpdatingCandidateId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCompanyOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/opportunities");
      const allOpps = res.data.opportunities || [];

      // Filter postings belonging to this company user
      const myOpps = allOpps.filter((o) => {
        const postedById = (o.postedBy?._id || o.postedBy)?.toString();
        return postedById === user?.id?.toString();
      });

      setOpportunities(myOpps.length > 0 ? myOpps : allOpps);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError(err.response?.data?.message || "Failed to load candidate applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyOpportunities();
  }, []);

  const handleUpdateStatus = async (opportunityId, studentId, newStatus) => {
    try {
      setUpdatingCandidateId(studentId);
      setError("");
      setMessage("");

      await api.patch(`/opportunities/${opportunityId}/applicants/${studentId}`, {
        status: newStatus,
      });

      setMessage(`Candidate status updated to '${newStatus}'.`);
      setTimeout(() => setMessage(""), 3500);

      // Update in local state immediately
      setOpportunities((prev) =>
        prev.map((opp) => {
          if (opp._id === opportunityId) {
            return {
              ...opp,
              applicants: opp.applicants.map((app) => {
                const appStudentId = (app.student?._id || app.student)?.toString();
                if (appStudentId === studentId) {
                  return { ...app, status: newStatus };
                }
                return app;
              }),
            };
          }
          return opp;
        })
      );
    } catch (err) {
      console.error("Failed to update applicant status:", err);
      setError(err.response?.data?.message || "Failed to update candidate status.");
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  // Compile all applicants across the selected postings
  const applicantRows = [];
  opportunities.forEach((opp) => {
    if (selectedOppId !== "all" && opp._id !== selectedOppId) return;

    if (opp.applicants && opp.applicants.length > 0) {
      opp.applicants.forEach((app) => {
        const student = app.student || {};
        applicantRows.push({
          opportunityId: opp._id,
          opportunityTitle: opp.title,
          studentId: (student._id || student).toString(),
          studentName: student.name || "Student Candidate",
          studentEmail: student.email || "—",
          status: app.status || "applied",
          appliedAt: app.appliedAt,
          matchScore: app.matchScore,
          matchReasoning: app.matchReasoning,
        });
      });
    }
  });

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        brand={displayName}
        subtitle="Company"
        items={companyItems}
        active="Applications"
      />
      <div className="flex-1">
        <Topbar placeholder="Search applicants..." />
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-extrabold">Candidate Applications</h2>
            <span className="text-xs text-muted font-medium">
              {applicantRows.length} Total Applicants
            </span>
          </div>
          <p className="text-muted text-sm mb-6">
            Review applicant competencies and manage interview shortlists.
          </p>

          {message && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              <CheckCircle size={15} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Filter by posting */}
          {opportunities.length > 0 && (
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-xs text-muted font-medium flex items-center gap-1.5">
                <Briefcase size={14} /> Filter by Opportunity:
              </span>
              <select
                className="border border-[#ECEBF5] rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#1E1B33]"
                value={selectedOppId}
                onChange={(e) => setSelectedOppId(e.target.value)}
              >
                <option value="all">All Postings ({opportunities.length})</option>
                {opportunities.map((opp) => (
                  <option key={opp._id} value={opp._id}>
                    {opp.title} ({opp.applicants?.length || 0} applicants)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="card">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading candidate applications...</p>
              </div>
            ) : applicantRows.length === 0 ? (
              <EmptyState
                title="No applications received yet"
                message="Candidates who apply to your opportunities will be displayed here for evaluation and shortlisting."
              />
            ) : (
              <div className="flex flex-col divide-y divide-[#ECEBF5]">
                {applicantRows.map((app) => {
                  const style = statusStyles[app.status] || statusStyles.applied;
                  const isBusy = updatingCandidateId === app.studentId;

                  return (
                    <div
                      key={`${app.opportunityId}-${app.studentId}`}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between flex-wrap gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-violet text-white flex items-center justify-center font-bold text-sm">
                          {app.studentName[0]?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-[#1E1B33]">
                              {app.studentName}
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${style.class}`}
                            >
                              {style.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted">
                            {app.studentEmail} · Applied for{" "}
                            <span className="font-semibold text-slate-700">
                              {app.opportunityTitle}
                            </span>
                          </p>
                          {app.matchScore !== undefined && (
                            <p className="text-[11px] text-primary font-semibold mt-1">
                              Match Score: {app.matchScore}%
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action status buttons */}
                      <div className="flex items-center gap-2">
                        {isBusy ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted px-3 py-1">
                            <Loader2 size={13} className="animate-spin text-primary" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            {app.status !== "shortlisted" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    app.opportunityId,
                                    app.studentId,
                                    "shortlisted"
                                  )
                                }
                                className="border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Clock size={12} /> Shortlist
                              </button>
                            )}

                            {app.status !== "accepted" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    app.opportunityId,
                                    app.studentId,
                                    "accepted"
                                  )
                                }
                                className="border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Check size={12} /> Accept
                              </button>
                            )}

                            {app.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    app.opportunityId,
                                    app.studentId,
                                    "rejected"
                                  )
                                }
                                className="border border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            )}
                          </>
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
    </div>
  );
}