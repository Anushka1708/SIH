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
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          done ? "bg-green text-white" : "bg-bg text-muted"
        }`}>
          {done ? "✓" : step}
        </div>
        {!last && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className="pb-6">
        <p className="text-sm font-semibold text-[#1E1B33]">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
  );
}