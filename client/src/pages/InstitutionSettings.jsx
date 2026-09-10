import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { institutionItems } from "./InstitutionDashboard";

export default function InstitutionSettings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const displayName = user?.institutionName || user?.name || "Institution";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Settings" />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Settings</h2>
          <p className="text-muted text-sm mb-6">Manage institution account preferences.</p>

          <div className="card flex flex-col gap-4">
            <label className="flex items-center justify-between text-sm"><span>Weekly report emails</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between text-sm"><span>Collaboration requests</span><input type="checkbox" defaultChecked /></label>
            <hr className="border-line" />
            <button onClick={handleLogout} className="btn-ghost justify-center text-red">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}