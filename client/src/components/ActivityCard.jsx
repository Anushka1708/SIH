const statusStyle = {
  Applied: "bg-[#EEF0FD] text-primary",
  Shortlisted: "bg-greenSoft text-green",
  Interview: "bg-amberSoft text-amber",
};

export default function ActivityCard({ name, info, role, status, time }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#ECEBF5] last:border-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet" />
        <div>
          <p className="text-sm font-semibold text-[#1E1B33]">{name}</p>
          <p className="text-xs text-muted">{info} · {role}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`status-pill ${statusStyle[status] || "bg-bg text-muted"}`}>{status}</span>
        <p className="text-[11px] text-muted mt-1 font-mono">{time}</p>
      </div>
    </div>
  );
}