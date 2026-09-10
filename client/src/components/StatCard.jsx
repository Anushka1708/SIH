// import React from 'react';

// export default function StatCard() {
//   return (
//     <div className="w-64 bg-surface text-clay min-h-screen p-4 font-body">
//       <h2 className="font-head text-xl text-growth font-semibold mb-4">Statistics</h2>
//     </div>
//   );
// }

const colorMap = {
  primary: { bg: "bg-[#EEF0FD]", text: "text-primary" },
  green: { bg: "bg-greenSoft", text: "text-green" },
  amber: { bg: "bg-amberSoft", text: "text-amber" },
  red: { bg: "bg-redSoft", text: "text-red" },
};

export default function StatCard({ icon, label, value, change, color = "primary" }) {
  const c = colorMap[color] || colorMap.primary;
  return (
    <div className="card flex-1 min-w-[180px]">
      <div className="flex items-center gap-3 mb-3">
        <div className={`stat-icon ${c.bg} ${c.text}`}>{icon}</div>
        <p className="text-sm text-muted font-medium">{label}</p>
      </div>
      <p className="text-2xl font-extrabold text-[#1E1B33]">{value}</p>
      {change && <p className={`text-xs mt-1 font-semibold ${c.text}`}>{change}</p>}
    </div>
  );
}