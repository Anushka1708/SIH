// import React from 'react';

// export default function RoadmapStep() {
//   return (
//     <div className="w-64 bg-surface text-clay min-h-screen p-4 font-body">
//       <h2 className="font-head text-xl text-growth font-semibold mb-4">Roadmap Step</h2>
//     </div>
//   );
// }

export default function RoadmapStep({ step, title, description, done, last }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            done
              ? "bg-green text-white"
              : "bg-slate-100 dark:bg-[#2E2A52] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#4B4578]"
          }`}
        >
          {done ? "✓" : step}
        </div>
        {!last && <div className="w-px flex-1 bg-border dark:bg-[#2E2A52]" />}
      </div>
      <div className="pb-6">
        <p className="text-sm font-semibold text-[#1E1B33] dark:text-[#F3F4F6]">{title}</p>
        <p className="text-xs text-muted dark:text-[#9CA3AF] mt-0.5">{description}</p>
      </div>
    </div>
  );
}