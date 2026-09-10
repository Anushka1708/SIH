import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { institutionItems } from "./InstitutionDashboard";

const programs = [
  { title: "Full Stack Web Development", enrolled: 320, duration: "12 weeks" },
  { title: "Data Science Bootcamp", enrolled: 210, duration: "16 weeks" },
];

export default function InstitutionLearning() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || "Institution";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Learning Programs" />
      <div className="flex-1">
        <Topbar placeholder="Search programs..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Learning Programs</h2>
          <p className="text-muted text-sm mb-6">Skill-building programs offered to your students.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div key={p.title} className="card">
                <p className="text-sm font-semibold text-[#1E1B33] mb-1">{p.title}</p>
                <p className="text-xs text-muted">{p.enrolled} enrolled · {p.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}