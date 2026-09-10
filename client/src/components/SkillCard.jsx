export default function SkillCard({ skills }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {skills.map((s) => (
        <li key={s.name}>
          <div className="flex justify-between text-[13px] mb-1.5">
            <span className="text-[#1E1B33] font-medium">{s.name}</span>
            <span className="text-muted font-mono">{s.percent}%</span>
          </div>
          <div className="h-1.5 bg-bg rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${s.percent}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}