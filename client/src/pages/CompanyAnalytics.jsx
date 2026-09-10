import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SkillCard from "../components/SkillCard";
import { getCurrentUser } from "../utils/auth";
import { companyData as d } from "../data/mockData";
import { companyItems } from "./CompanyDashboard";

export default function CompanyAnalytics() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";
  const max = Math.max(...d.stats.map((s) => (typeof s.value === "number" ? s.value : 0)));

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Analytics" />
      <div className="flex-1">
        <Topbar placeholder="Search analytics..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Analytics</h2>
          <p className="text-muted text-sm mb-6">Track your hiring funnel and applicant trends.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <p className="font-semibold text-[#1E1B33] text-sm mb-4">Hiring Funnel</p>
              <div className="flex items-end gap-4 h-40">
                {d.stats.map((s) => (
                  <div key={s.label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary rounded-t-md" style={{ height: `${(Number(s.value) || 10 / max) * 100}%` }} />
                    <span className="text-[11px] text-muted text-center">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <p className="font-semibold text-[#1E1B33] text-sm mb-4">Top Skills in Applications</p>
              <SkillCard skills={d.topSkills} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}