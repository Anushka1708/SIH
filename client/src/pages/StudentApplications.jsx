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
  Loader2,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
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

const statuses = [
  "All",
  "applied",
  "reviewing",
  "shortlisted",
  "interview",
  "accepted",
  "rejected",
];

const statusStyles = {
  applied: { label: "Applied", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  reviewing: { label: "Under Review", class: "bg-sky-50 text-sky-700 border-sky-200" },
  shortlisted: { label: "Shortlisted", class: "bg-amber-50 text-amber-700 border-amber-200" },
  interview: { label: "Interview", class: "bg-purple-50 text-purple-700 border-purple-200" },
  accepted: { label: "Accepted / Hired", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", class: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function StudentApplications() {
  const user = getCurrentUser();
  const displayName = user?.name || "Student";

  const [filterStatus, setFilterStatus] = useState("All");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/opportunities");
        const allOpps = res.data.opportunities || [];

        // Extract applications submitted by the logged-in student
        const userApps = [];
        allOpps.forEach((opp) => {
          if (opp.applicants && user?.id) {
            const myApplicantEntry = opp.applicants.find(
              (a) => (a.student?._id || a.student)?.toString() === user.id.toString()
            );

            if (myApplicantEntry) {
              userApps.push({
                opportunityId: opp._id,
                title: opp.title,
                type: opp.type,
                location: opp.location,
                stipend: opp.stipend,
                companyName:
                  opp.company?.companyName || opp.postedBy?.name || "Verified Partner",
                status: myApplicantEntry.status || "applied",
                appliedAt: myApplicantEntry.appliedAt,
                matchScore: myApplicantEntry.matchScore,
                matchReasoning: myApplicantEntry.matchReasoning,
              });
            }
          }
        });

        // Sort latest application first
        userApps.sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));
        setApplications(userApps);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError(err.response?.data?.message || "Failed to load applications from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filtered = applications.filter((a) => {
    if (filterStatus === "All") return true;
    return a.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Student" items={items} active="Applications" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-extrabold text-[#1E1B33]">Applications</h2>
            <span className="text-xs text-muted font-medium">
              Application Tracker ({applications.length} Total)
            </span>
          </div>
          <p className="text-muted text-xs md:text-sm mb-6">
            Track real-time candidate review status across all your submitted applications.
          </p>

          {error && (
            <p className="text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl border capitalize transition whitespace-nowrap ${
                  filterStatus === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-[#ECEBF5] text-muted hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="card">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading application status...</p>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No applications found"
                message={
                  filterStatus === "All"
                    ? "You haven't applied to any opportunities yet. Check out the Opportunities tab!"
                    : `No applications found with status '${filterStatus}'.`
                }
              />
            ) : (
              <div className="flex flex-col divide-y divide-[#ECEBF5]">
                {filtered.map((app) => {
                  const style = statusStyles[app.status] || statusStyles.applied;
                  const dateStr = app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <div
                      key={app.opportunityId}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between flex-wrap gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-violet/10 text-primary flex items-center justify-center font-bold text-sm">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-[#1E1B33]">{app.title}</h3>
                            <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {app.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-slate-700">{app.companyName}</span>
                            {app.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} /> {app.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> Applied on {dateStr}
                            </span>
                          </p>
                          {app.matchScore !== undefined && (
                            <p className="text-[11px] text-primary font-medium mt-1">
                              Match Score: {app.matchScore}%{" "}
                              {app.matchReasoning && `— ${app.matchReasoning}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.class}`}
                        >
                          {style.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}