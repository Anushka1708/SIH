import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { companyItems } from "./CompanyDashboard";

export default function CompanySettings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const displayName = user?.companyName || user?.name || "Company";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Settings" />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Settings</h2>
          <p className="text-muted text-sm mb-6">Manage account preferences and security.</p>

          <div className="card flex flex-col gap-4">
            <label className="flex items-center justify-between text-sm">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>New applicant alerts</span>
              <input type="checkbox" defaultChecked />
            </label>
            <hr className="border-line" />
            <button onClick={handleLogout} className="btn-ghost justify-center text-red">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}