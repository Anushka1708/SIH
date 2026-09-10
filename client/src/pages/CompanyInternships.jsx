import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";

const internships = [
  { title: "Frontend Developer Intern", applicants: 24, status: "Active" },
  { title: "Backend Developer Intern", applicants: 18, status: "Active" },
  { title: "UI/UX Design Intern", applicants: 12, status: "Closing Soon" },
];

const statusStyle = { Active: "bg-greenSoft text-green", "Closing Soon": "bg-amberSoft text-amber" };

export default function CompanyInternships() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Internships" />
      <div className="flex-1">
        <Topbar placeholder="Search internships..." />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold mb-1">Internships</h2>
              <p className="text-muted text-sm">Manage all your posted internship listings.</p>
            </div>
            <a href="/company/postopportunity" className="btn-primary !px-4 !py-2 text-sm">+ New Internship</a>
          </div>

          <div className="card">
            <ul>
              {internships.map((i) => (
                <li key={i.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{i.title}</p>
                    <p className="text-xs text-muted">{i.applicants} applicants</p>
                  </div>
                  <span className={`status-pill ${statusStyle[i.status]}`}>{i.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}