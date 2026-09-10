import { Search, Bell, Mail } from "lucide-react";

export default function Topbar({ placeholder }) {
  return (
    <div className="flex items-center justify-between bg-white border-b border-[#ECEBF5] px-6 py-4">
      <div className="flex items-center gap-2 bg-bg rounded-xl px-3 py-2.5 w-96">
        <Search size={16} className="text-muted" />
        <input className="bg-transparent text-sm outline-none w-full" placeholder={placeholder || "Search..."} />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-muted"><Mail size={20} /></button>
        <button className="relative text-muted">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red" />
        </button>
        <div className="w-9 h-9 rounded-full bg-violet" />
      </div>
    </div>
  );
}