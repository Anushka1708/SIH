export default function OpportunityCard({ title, company, location, stipend, matched = [], gap = [] }) {
  return (
    <div className="border border-[#ECEBF5] rounded-xl2 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-[#1E1B33]">{title}</p>
          <p className="text-xs text-muted">{company} · {location} · {stipend}</p>
        </div>
        <button className="btn-primary !px-4 !py-2 text-xs">View</button>
      </div>
      <div className="mt-2">
        {matched.map((m) => <span key={m} className="tag tag-matched">{m}</span>)}
        {gap.map((g) => <span key={g} className="tag tag-gap">{g}</span>)}
      </div>
    </div>
  );
}