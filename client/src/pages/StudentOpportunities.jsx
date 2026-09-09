import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import OpportunityCard from "../components/OpportunityCard";
import EmptyState from "../components/EmptyState";
import { studentData } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

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

const types = ["All", "Internship", "Job", "Project"];

export default function StudentOpportunities() {
  const user = getCurrentUser();
  const displayName = user?.name || "Student";

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const filtered = studentData.opportunities.filter((o) => {
    const matchesType = type === "All" || o.type === type;
    const matchesQuery =
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.company.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Opportunities</h2>
          <p className="text-muted text-sm mb-6">Browse internships, jobs and projects matched to your skills.</p>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <label className="flex items-center gap-2 bg-white border border-[#ECEBF5] rounded-xl px-3 py-2.5 flex-1">
              <Search size={16} className="text-muted" />
              <input
                className="outline-none text-sm w-full"
                placeholder="Search by title or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="flex gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs font-semibold px-4 py-2.5 rounded-xl border ${
                    type === t
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-[#ECEBF5] text-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            {filtered.length === 0 ? (
              <EmptyState
                title="No opportunities found"
                message="Try adjusting your search or filters."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((o) => (
                  <OpportunityCard key={o.title} {...o} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}