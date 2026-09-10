import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { motion } from "framer-motion";

export default function Sidebar({ brand, subtitle, items = [], active }) {
  const location = useLocation();
  const user = getCurrentUser();

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

  const getProfileUrl = () => {
    if (!user?.role) return "/student/profile";
    return `/${user.role}/profile`;
  };

  const isItemActive = (item) => {
    if (!item?.href || item.href === "#") return false;
    if (active && active.toLowerCase() === item.label?.toLowerCase()) return true;

    const current = location.pathname.replace(/\/$/, "");
    const target = item.href.replace(/\/$/, "");

    if (current === target) return true;

    // Handle dashboard aliases
    if (
      (current === "/student" || current === "/student/dashboard") &&
      (target === "/student" || target === "/student/dashboard")
    ) {
      return true;
    }
    if (
      (current === "/company" || current === "/company/dashboard") &&
      (target === "/company" || target === "/company/dashboard")
    ) {
      return true;
    }
    if (
      (current === "/faculty" || current === "/faculty/dashboard") &&
      (target === "/faculty" || target === "/faculty/dashboard")
    ) {
      return true;
    }
    if (
      (current === "/institution" || current === "/institution/dashboard") &&
      (target === "/institution" || target === "/institution/dashboard")
    ) {
      return true;
    }

    // Subpaths (e.g. /student/opportunities/123 matches /student/opportunities)
    const baseRoles = ["/student", "/company", "/faculty", "/institution"];
    if (!baseRoles.includes(target) && current.startsWith(target + "/")) {
      return true;
    }

    return false;
  };

  const dashboardUrl = getDashboardUrl();
  const rawBrand = brand || user?.name || "Guest User";
  const cleanBrand = rawBrand.replace(/\s*\((?:Google|Google User)\)\s*/gi, "").trim();

  const initials = (cleanBrand || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className="w-64 min-h-screen flex flex-col p-4 text-white select-none border-r border-white/5"
      style={{ background: "linear-gradient(180deg, #131032 0%, #1D1845 100%)" }}
    >
      {/* Clickable SkillBridge Brand Logo */}
      <Link
        to={dashboardUrl}
        className="flex items-center gap-2.5 px-2 mb-7 group transition-opacity hover:opacity-95"
        title="SkillBridge Dashboard"
      >
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
          S
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight text-white leading-none">
            SkillBridge
          </span>
          <span className="text-white/30 text-xs font-light">|</span>
          <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase">
            TALENT PLATFORM
          </span>
        </div>
      </Link>

      {/* User Brand Profile Snippet */}
      <Link
        to={getProfileUrl()}
        className="flex items-center gap-3 px-2 py-2 mb-6 rounded-xl hover:bg-white/5 transition group border border-transparent hover:border-white/10"
        title="Go to profile"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
          {initials}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-semibold leading-tight text-white group-hover:text-indigo-200 transition truncate">
            {cleanBrand || "Guest User"}
          </p>
          <p className="text-[11px] text-[#9791C4] leading-tight capitalize mt-0.5">
            {subtitle || user?.role || "Member"}
          </p>
        </div>
      </Link>

      {/* Navigation Items (Profile and Settings relocated to Topbar) */}
      <nav className="flex-1 space-y-1">
        {items
          .filter(
            (item) =>
              item.label?.toLowerCase() !== "profile" &&
              item.label?.toLowerCase() !== "settings"
          )
          .map((item) => {
            const activeItem = isItemActive(item);
            return (
              <Link
                key={item.label}
                to={item.href || "#"}
                className={`rail-item ${activeItem ? "active" : ""}`}
              >
              <item.icon size={17} className={activeItem ? "text-white" : "text-[#C9C5E8]"} />
              <span className="truncate">{item.label}</span>
              {activeItem && (
                <motion.span
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom version badge */}
      <div className="pt-4 border-t border-white/5 px-2 text-[11px] text-[#7C75A8] flex items-center justify-between">
        <span>SkillBridge v2.0</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
      </div>
    </aside>
  );
}