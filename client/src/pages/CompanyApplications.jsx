import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ActivityCard from "../components/ActivityCard";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { companyData as d } from "../data/mockData";
import { companyItems } from "./CompanyDashboard";

export default function CompanyApplications() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Applications" />
      <div className="flex-1">
        <Topbar placeholder="Search applicants..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Applications</h2>
          <p className="text-muted text-sm mb-6">Review and manage candidates who applied to your postings.</p>

          <div className="card">
            {d.recentApplications.length > 0 ? (
              d.recentApplications.map((a) => <ActivityCard key={a.name} {...a} />)
            ) : (
              <EmptyState title="No applications yet" message="Once students apply, they'll show up here." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}