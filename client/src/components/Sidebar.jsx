import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ brand, subtitle, items }) {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen flex flex-col p-4 text-white"
      style={{ background: "linear-gradient(180deg, #151235 0%, #211B4E 100%)" }}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center font-bold">S</div>
        <span className="font-bold text-lg">SkillBridge</span>
      </div>

      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-9 h-9 rounded-full bg-violet" />
        <div>
          <p className="text-sm font-semibold leading-tight">{brand}</p>
          <p className="text-xs text-[#9791C4] leading-tight">{subtitle}</p>
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.href || "#"}
            className={`rail-item ${location.pathname === item.href ? "active" : ""}`}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}