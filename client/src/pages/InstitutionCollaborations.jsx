import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { institutionData as d } from "../data/mockData";
import { institutionItems } from "./InstitutionDashboard";

const statusStyle = { Active: "bg-greenSoft text-green", Upcoming: "bg-amberSoft text-amber", Completed: "bg-bg text-muted" };

export default function InstitutionCollaborations() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || "Institution";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Collaborations" />
      <div className="flex-1">
        <Topbar placeholder="Search collaborations..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Collaborations</h2>
          <p className="text-muted text-sm mb-6">Industry partnerships and joint programs.</p>

          <div className="card">
            <ul>
              {d.collaborations.map((c) => (
                <li key={c.name} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{c.name}</p>
                    <p className="text-xs text-muted">{c.type}</p>
                  </div>
                  <span className={`status-pill ${statusStyle[c.status]}`}>{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}