import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  X,
  CheckCheck,
  Trash2,
  ExternalLink,
  Briefcase,
  Award,
  Sparkles,
  FileEdit,
  User,
  Settings,
  LogOut,
  Info,
  Sun,
  Moon,
  WifiOff,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredTheme, toggleTheme, isCurrentlyDark } from "../utils/theme";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New High-Match Opportunity",
    desc: "AI Research Intern at TechCorp matches 92% of your skill vector.",
    time: "15m ago",
    read: false,
    type: "opportunity",
    link: "/student/opportunities",
  },
  {
    id: 2,
    title: "Skill Verification Verified",
    desc: "Your React.js assessment score (85/100) has been verified into your vector.",
    time: "2h ago",
    read: false,
    type: "skill",
    link: "/student/skills",
  },
  {
    id: 3,
    title: "AI Roadmap Updated",
    desc: "New milestones generated for Cloud DevOps engineering path.",
    time: "1d ago",
    read: true,
    type: "learning",
    link: "/student/learning",
  },
];

const SEARCH_SHORTCUTS = [
  { label: "Recommended Opportunities", icon: Briefcase, href: "/student/opportunities", category: "Jobs & Internships" },
  { label: "Verified Skills & Badges", icon: Award, href: "/student/skills", category: "Competencies" },
  { label: "Resume & Portfolio Manager", icon: FileEdit, href: "/student/resume", category: "Documents" },
  { label: "AI Career Roadmaps", icon: Sparkles, href: "/student/learning", category: "Learning" },
  { label: "Student Profile", icon: User, href: "/student/profile", category: "Account" },
  { label: "Account Settings", icon: Settings, href: "/student/settings", category: "Settings" },
];

export default function Topbar({ placeholder = "Search opportunities, skills, courses...", onSearch }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleThemeEv = () => setCurrentTheme(getStoredTheme());
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("theme-change", handleThemeEv);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("theme-change", handleThemeEv);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearchFocused(false);
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        const dest = user?.role === "student" ? "/student/opportunities" : "/company/postopportunity";
        navigate(`${dest}?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardUrl = () => {
    if (!user) return "/";
    switch (user.role) {
      case "student":
        return "/student";
      case "company":
        return "/company";
      case "faculty":
        return "/faculty";
      case "institution":
        return "/institution";
      default:
        return "/";
    }
  };

  const filteredShortcuts = searchQuery.trim()
    ? SEARCH_SHORTCUTS.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SHORTCUTS.slice(0, 4);

  const rawName = user?.name || "Guest";
  const cleanName = rawName.replace(/\s*\((?:Google|Google User)\)\s*/gi, "").trim();

  const initials = (cleanName || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#E2E8F0] dark:border-[#2E2A52] bg-white/95 dark:bg-[#130F2E]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Mobile Branding / Dashboard Link */}
      <div className="md:hidden flex items-center mr-3">
        <Link
          to={getDashboardUrl()}
          className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-white text-sm shadow-sm"
          title="SkillBridge Dashboard"
        >
          S
        </Link>
      </div>

      {/* Interactive Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-lg">
        <div
          className={`flex items-center gap-2.5 bg-[#F4F5FB] dark:bg-[#1E1B3B] rounded-xl px-3.5 py-2.5 border transition-all ${
            isSearchFocused
              ? "border-primary bg-white dark:bg-[#130F2E] shadow-sm ring-2 ring-primary/10"
              : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <Search size={16} className={isSearchFocused ? "text-primary" : "text-slate-400"} />
          <input
            className="bg-transparent outline-none text-xs md:text-sm w-full text-[#0F172A] dark:text-[#F3F4F6] placeholder:text-slate-400"
            placeholder={placeholder}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchSubmit}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dynamic Search Quick Jump Dropdown */}
        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-12 bg-white dark:bg-[#130F2E] rounded-2xl border border-[#E2E8F0] dark:border-[#2E2A52] shadow-xl p-3 z-50"
            >
              <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100 dark:border-[#2E2A52] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>{searchQuery ? "Filtered Suggestions" : "Quick Actions"}</span>
                <span className="text-[10px] normal-case bg-slate-100 dark:bg-[#1E1B3B] px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                  Press Enter to search
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {filteredShortcuts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsSearchFocused(false);
                      navigate(item.href);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 flex items-center justify-center">
                        <item.icon size={14} />
                      </div>
                      <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F3F4F6] group-hover:text-primary transition">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </button>
                ))}

                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setIsSearchFocused(false);
                      navigate(`/student/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition group mt-1 pt-2 border-t border-slate-100 dark:border-[#2E2A52]"
                  >
                    <span className="text-xs font-semibold text-primary">
                      Search opportunities for "{searchQuery.trim()}"
                    </span>
                    <span className="text-[10px] text-slate-400">Press Enter ↵</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls & Profile Menu */}
      <div className="flex items-center gap-3 ml-4">
        {/* Offline Status Badge */}
        {!isOnline && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shadow-sm animate-pulse">
            <WifiOff size={13} />
            <span>Offline</span>
          </span>
        )}

        {/* Notification Bell with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#130F2E] animate-pulse" />
            )}
          </button>

          {/* Interactive Notifications Popover */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-[#130F2E] rounded-2xl border border-[#E2E8F0] dark:border-[#2E2A52] shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-[#2E2A52] bg-slate-50 dark:bg-[#1E1B3B]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                        title="Mark all as read"
                      >
                        <CheckCheck size={13} /> Read all
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearNotifications}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
                        title="Clear all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2E2A52]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center mb-2">
                        <Bell size={20} />
                      </div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6]">No new notifications</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        You're completely up to date with platform updates!
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3.5 hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition cursor-pointer flex gap-3 ${
                          !notif.read ? "bg-indigo-50/30 dark:bg-indigo-500/10" : ""
                        }`}
                      >
                        <div className="mt-0.5">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                              notif.type === "opportunity"
                                ? "bg-indigo-100 text-primary dark:bg-indigo-500/30 dark:text-indigo-300"
                                : notif.type === "skill"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300"
                            }`}
                          >
                            {notif.type === "opportunity" ? (
                              <Briefcase size={13} />
                            ) : notif.type === "skill" ? (
                              <Award size={13} />
                            ) : (
                              <Sparkles size={13} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6]">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-[#E2E8F0] dark:border-[#2E2A52] bg-slate-50 dark:bg-[#1E1B3B]/60 text-center">
                  <Link
                    to={getDashboardUrl()}
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-primary font-semibold hover:underline"
                  >
                    View platform dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar & Dropdown Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-tight group-hover:text-primary transition">
                {cleanName || "Guest"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-slate-500 dark:text-[#9CA3AF] leading-tight capitalize">
                  {user?.role || "Member"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {/* User Options Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-2xl shadow-xl py-2 w-56 z-50 overflow-hidden"
              >
                {/* User Name & Role Pill Header */}
                <div className="px-3.5 py-2.5 border-b border-[#E2E8F0] dark:border-[#2E2A52] mb-1 bg-slate-50 dark:bg-[#1E1B3B]/50">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] truncate">
                    {cleanName || "Guest User"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-[#9CA3AF] truncate mb-1.5">
                    {user?.email || ""}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    {user?.role || "Student"}
                  </span>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  <Link
                    to={user?.role ? `/${user.role}/profile` : "/student/profile"}
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] dark:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition"
                  >
                    <User size={15} className="text-slate-500 dark:text-indigo-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to={user?.role ? `/${user.role}/settings` : "/student/settings"}
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] dark:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition"
                  >
                    <Settings size={15} className="text-slate-500 dark:text-indigo-400" />
                    <span>Account Settings</span>
                  </Link>

                  {/* Quick Theme Toggle Option */}
                  <button
                    onClick={() => {
                      const next = toggleTheme();
                      setCurrentTheme(next);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#0F172A] dark:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {isCurrentlyDark() ? (
                        <Moon size={15} className="text-amber-400" />
                      ) : (
                        <Sun size={15} className="text-amber-500" />
                      )}
                      <span>Theme</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-[#9CA3AF] uppercase bg-slate-100 dark:bg-[#1E1B3B] px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-[#2E2A52]">
                      {isCurrentlyDark() ? "Dark" : "Light"}
                    </span>
                  </button>
                </div>

                <div className="border-t border-[#E2E8F0] dark:border-[#2E2A52] my-1" />

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}