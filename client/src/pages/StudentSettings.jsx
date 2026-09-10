import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings as SettingsIcon,
  Lock,
  Bell,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, logout } from "../utils/auth";
import { getStoredTheme, applyTheme } from "../utils/theme";

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

  const [theme, setThemeState] = useState(getStoredTheme());

  useEffect(() => {
    const handleThemeEvent = (e) => {
      if (e.detail?.theme) {
        setThemeState(e.detail.theme);
      }
    };
    window.addEventListener("theme-change", handleThemeEvent);
    return () => window.removeEventListener("theme-change", handleThemeEvent);
  }, []);

  const handleThemeChange = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

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
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Settings" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 max-w-2xl w-full mx-auto"
        >
          <h2 className="text-2xl font-extrabold text-[#1E1B33] mb-1">Settings</h2>
          <p className="text-muted text-xs md:text-sm mb-6">Manage your account preferences.</p>

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

          {/* Theme & Appearance Switcher */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-[#1E1B33] text-sm flex items-center gap-2">
                  <Sun size={16} className="text-amber-500" /> Interface Theme
                </p>
                <p className="text-xs text-muted mt-0.5">Customize your display appearance.</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                {theme} Mode
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { id: "light", label: "Light", icon: Sun, desc: "Crisp light" },
                { id: "dark", label: "Dark", icon: Moon, desc: "Dark glow" },
                { id: "system", label: "System", icon: Laptop, desc: "OS default" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleThemeChange(item.id)}
                  className={`flex flex-col items-center p-3.5 rounded-xl border transition-all text-center ${
                    theme === item.id
                      ? "border-primary bg-indigo-50/50 text-primary shadow-xs ring-2 ring-primary/20"
                      : "border-[#ECEBF5] hover:border-primary/40 bg-white text-slate-700"
                  }`}
                >
                  <item.icon size={20} className={theme === item.id ? "text-primary" : "text-muted"} />
                  <span className="text-xs font-bold mt-2">{item.label}</span>
                  <span className="text-[10px] text-muted mt-0.5">{item.desc}</span>
                  {theme === item.id && (
                    <span className="mt-2 text-[10px] font-bold text-primary flex items-center gap-0.5">
                      <Check size={11} /> Selected
                    </span>
                  )}
                </button>
              ))}
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
        </motion.div>
      </div>
    </div>
  );
}