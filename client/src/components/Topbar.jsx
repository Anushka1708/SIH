import { Search, Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";

export default function Topbar({ placeholder = "Search..." }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEBF5] bg-white">
      <label className="flex items-center gap-2 bg-bg rounded-xl px-3 py-2 w-full max-w-md">
        <Search size={16} className="text-muted" />
        <input
          className="bg-transparent outline-none text-sm w-full"
          placeholder={placeholder}
          type="text"
        />
      </label>

      <div className="flex items-center gap-5 ml-6">
        <button className="relative text-muted hover:text-primary">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red rounded-full" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer group relative">
          <div className="w-9 h-9 rounded-full bg-violet" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#1E1B33] leading-tight">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-muted leading-tight">{user?.role || ""}</p>
          </div>
          <ChevronDown size={16} className="text-muted" />

          <div className="absolute right-0 top-10 hidden group-hover:block bg-white border border-[#ECEBF5] rounded-xl shadow-lg py-2 w-40 z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red hover:bg-bg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}