import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  FileText,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Loader2,
  Search,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ActivityCard from "../components/ActivityCard";
import SkillCard from "../components/SkillCard";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";

export const companyItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/company" },
  { label: "Talent Discovery", icon: Search, href: "/company/talent-search" },
  { label: "Post Opportunity", icon: Send, href: "/company/postopportunity" },
  { label: "Applications", icon: FileText, href: "/company/applications" },
  { label: "Internships", icon: Users, href: "/company/internships" },
  { label: "Projects", icon: FolderKanban, href: "/company/projects" },
  { label: "Profile", icon: Users, href: "/company/profile" },
  { label: "Analytics", icon: BarChart3, href: "/company/analytics" },
  { label: "Settings", icon: Settings, href: "/company/settings" },
];

export default function CompanyDashboard() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplicants: 0,
    shortlisted: 0,
    hired: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchCompanyMetrics = async () => {
      try {
        setLoading(true);

        const oppRes = await api.get("/opportunities").catch(() => ({ data: {} }));
        const allOpps = oppRes.data?.opportunities || [];

        // Filter for this company's postings
        const myOpps = allOpps.filter(
          (o) => (o.postedBy?._id || o.postedBy)?.toString() === user?.id?.toString()
        );

        const targetOpps = myOpps.length > 0 ? myOpps : allOpps;

        let totalApps = 0;
        let shortlistedCount = 0;
        let hiredCount = 0;
        const appList = [];

        targetOpps.forEach((opp) => {
          if (opp.applicants && opp.applicants.length > 0) {
            opp.applicants.forEach((a) => {
              totalApps++;
              if (a.status === "shortlisted") shortlistedCount++;
              if (a.status === "accepted" || a.status === "hired") hiredCount++;

              const student = a.student || {};
              appList.push({
                name: student.name || "Student Candidate",
                info: student.email || "Candidate",
                role: opp.title,
                status:
                  a.status === "shortlisted"
                    ? "Shortlisted"
                    : a.status === "accepted" || a.status === "hired"
                    ? "Hired"
                    : "Applied",
                time: a.appliedAt
                  ? new Date(a.appliedAt).toLocaleDateString()
                  : "Recently",
              });
            });
          }
        });

        setStats({
          activePostings: targetOpps.length,
          totalApplicants: totalApps,
          shortlisted: shortlistedCount,
          hired: hiredCount,
        });

        setRecentApplications(appList.slice(0, 5));
      } catch (err) {
        console.error("Failed to load company metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyMetrics();
  }, []);

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Dashboard" />
      <div className="flex-1">
        <Topbar placeholder="Search candidates, skills..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Welcome back, {displayName}! 👋</h2>
          <p className="text-muted text-sm mb-6">
            Find the right talent. Build the future with verified student competencies.
          </p>

          {/* Live Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="💼"
              label="Active Postings"
              value={stats.activePostings}
              change="Live"
              color="primary"
            />
            <StatCard
              icon="👥"
              label="Total Applicants"
              value={stats.totalApplicants}
              change="Incoming"
              color="green"
            />
            <StatCard
              icon="⭐"
              label="Shortlisted"
              value={stats.shortlisted}
              color="amber"
            />
            <StatCard
              icon="🎉"
              label="Offers / Hired"
              value={stats.hired}
              color="green"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-[#1E1B33] text-sm">Recent Applications</p>
                <Link to="/company/applications" className="text-xs text-primary font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center items-center text-muted gap-2">
                  <Loader2 size={20} className="animate-spin text-primary" />
                  <span className="text-xs">Loading applications...</span>
                </div>
              ) : recentApplications.length === 0 ? (
                <p className="text-xs text-muted py-8 text-center">
                  No applications received yet. Postings are visible to students!
                </p>
              ) : (
                <div className="flex flex-col">
                  {recentApplications.map((a, i) => (
                    <ActivityCard key={i} {...a} />
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-[#1E1B33] text-sm">Post New Opportunity</p>
                <Link to="/company/postopportunity" className="text-xs text-primary font-semibold hover:underline">
                  Open Wizard
                </Link>
              </div>
              <p className="text-xs text-muted mb-4">
                Define skill requirements, minimum proficiency levels, and candidate weights for automated AI ranking.
              </p>
              <Link
                to="/company/postopportunity"
                className="btn-primary !py-2.5 text-xs justify-center flex items-center gap-2"
              >
                <Send size={13} />
                <span>Create New Listing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}