import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";

const projects = [
  { title: "E-commerce Redesign", team: 4, status: "In Progress" },
  { title: "AI Chatbot POC", team: 2, status: "Planning" },
];
const statusStyle = { "In Progress": "bg-[#EEF0FD] text-primary", Planning: "bg-amberSoft text-amber" };

export default function CompanyProjects() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Projects" />
      <div className="flex-1">
        <Topbar placeholder="Search projects..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Projects</h2>
          <p className="text-muted text-sm mb-6">Real-world projects offered to students for hands-on experience.</p>

          <div className="card">
            {projects.length > 0 ? (
              <ul>
                {projects.map((p) => (
                  <li key={p.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1B33]">{p.title}</p>
                      <p className="text-xs text-muted">{p.team} students assigned</p>
                    </div>
                    <span className={`status-pill ${statusStyle[p.status]}`}>{p.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No projects yet" message="Create a project to collaborate with students." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}