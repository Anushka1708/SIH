import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings as SettingsIcon, Lock, Bell, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, logout } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Opportunities", icon: Briefcase, href: "/student/opportunities" },
  { label: "Applications", icon: FileText, href: "/student/applications" },
  { label: "Resume & Portfolio", icon: FileEdit, href: "/student/resume" },
  { label: "Learning Programs", icon: BookOpen, href: "/student/learning" },
  { label: "Settings", icon: SettingsIcon, href: "/student/settings" },
];

export default function StudentSettings() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordMsg, setPasswordMsg] = useState("");

  const [notifications, setNotifications] = useState({
    email: true,
    opportunities: true,
    applicationUpdates: true,
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      setPasswordMsg("Please fill all fields.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    setPasswordMsg("Password updated successfully.");
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setPasswordMsg(""), 2500);
  };

  const toggleNotif = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6 max-w-2xl">
          <h2 className="text-xl font-extrabold mb-1">Settings</h2>
          <p className="text-muted text-sm mb-6">Manage your account preferences.</p>

          {/* Account info */}
          <div className="card mb-6">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4">Account</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Name</span>
              <span className="text-[#1E1B33] font-medium">{user?.name || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Email</span>
              <span className="text-[#1E1B33] font-medium">{user?.email || "—"}</span>
            </div>
          </div>

          {/* Password */}
          <div className="card mb-6">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4 flex items-center gap-2">
              <Lock size={15} /> Change Password
            </p>

            {passwordMsg && (
              <p className={`text-sm rounded-lg px-3 py-2 mb-4 ${
                passwordMsg.includes("success") ? "text-green bg-greenSoft" : "text-red bg-redSoft"
              }`}>
                {passwordMsg}
              </p>
            )}

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Current password"
                className="border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-sm outline-none"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
              <input
                type="password"
                placeholder="New password"
                className="border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-sm outline-none"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-sm outline-none"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <button type="submit" className="btn-primary !px-5 !py-2.5 text-xs self-start">
                Update Password
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="card mb-6">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4 flex items-center gap-2">
              <Bell size={15} /> Notifications
            </p>
            <div className="flex flex-col gap-3">
              {[
                { key: "email", label: "Email notifications" },
                { key: "opportunities", label: "New matched opportunities" },
                { key: "applicationUpdates", label: "Application status updates" },
              ].map((n) => (
                <label key={n.key} className="flex items-center justify-between text-sm">
                  <span className="text-[#1E1B33]">{n.label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[n.key]}
                    onChange={() => toggleNotif(n.key)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="card border border-redSoft">
            <p className="font-semibold text-red text-sm mb-4">Danger Zone</p>
            <button
              onClick={handleLogout}
              className="btn-ghost !text-red !border-red/20 !px-5 !py-2.5 text-xs flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}