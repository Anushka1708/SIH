import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { facultyItems } from "./FacultyDashboard";

export default function FacultySettings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const displayName = user?.name || "Faculty";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Settings" />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Settings</h2>
          <p className="text-muted text-sm mb-6">Manage your account preferences.</p>

          <div className="card flex flex-col gap-4">
            <label className="flex items-center justify-between text-sm"><span>Session reminders</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between text-sm"><span>Grading notifications</span><input type="checkbox" defaultChecked /></label>
            <hr className="border-line" />
            <button onClick={handleLogout} className="btn-ghost justify-center text-red">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}