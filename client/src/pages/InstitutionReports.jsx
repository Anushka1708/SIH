import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { institutionData as d } from "../data/mockData";
import { institutionItems } from "./InstitutionDashboard";

export default function InstitutionReports() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || "Institution";
  const max = Math.max(...d.enrollment);

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Reports" />
      <div className="flex-1">
        <Topbar placeholder="Search reports..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Reports</h2>
          <p className="text-muted text-sm mb-6">Placement and enrollment trends over time.</p>

          <div className="card">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4">Enrollment Trend</p>
            <div className="flex items-end gap-3 h-48">
              {d.enrollment.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary rounded-t-md" style={{ height: `${(v / max) * 100}%` }} />
                  <span className="text-xs text-muted font-mono">{d.months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}