// import React from 'react';

// export default function StatCard() {
//   return (
//     <div className="w-64 bg-surface text-clay min-h-screen p-4 font-body">
//       <h2 className="font-head text-xl text-growth font-semibold mb-4">Statistics</h2>
//     </div>
//   );
// }

const colorMap = {
  primary: { bg: "bg-indigo-50 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-300" },
  green: { bg: "bg-emerald-50 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-300" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-300" },
  red: { bg: "bg-rose-50 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-300" },
};

export default function StatCard({ icon, label, value, change, color = "primary", onClick }) {
  const c = colorMap[color] || colorMap.primary;
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-2xl p-5 shadow-sm flex-1 min-w-[180px] transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:-translate-y-1 hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
          : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${c.bg} ${c.text}`}>
          {icon}
        </div>
        <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] font-semibold">{label}</p>
      </div>
      <p className="text-2xl font-black text-[#0F172A] dark:text-[#F3F4F6] tracking-tight">{value}</p>
      {change && <p className={`text-xs mt-1.5 font-bold ${c.text}`}>{change}</p>}
    </div>
  );
}