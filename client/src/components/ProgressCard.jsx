export default function ProgressCard({ percent, skills }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#1E1B33]">Skill Progress</p>
        <a href="#" className="text-xs text-primary font-semibold">View All</a>
      </div>
      <div className="flex items-center gap-5">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#ECEBF5" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#4F46E5" strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 50 50)" />
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1E1B33">{percent}%</text>
        </svg>
        <ul className="text-xs text-muted flex flex-col gap-2 font-mono">
          {skills.map((s) => (
            <li key={s.name} className="flex justify-between gap-6">
              <span className="font-sans text-[#1E1B33]">{s.name}</span><span>{s.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}