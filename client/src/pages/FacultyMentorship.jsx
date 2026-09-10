import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyData as d } from "../data/mockData";
import { facultyItems } from "./FacultyDashboard";

export default function FacultyMentorship() {
  const user = getCurrentUser();
  const displayName = user?.name || "Faculty";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Mentorship" />
      <div className="flex-1">
        <Topbar placeholder="Search sessions..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Mentorship</h2>
          <p className="text-muted text-sm mb-6">Your scheduled mentorship and guidance sessions.</p>

          <div className="card">
            <ul>
              {d.sessions.map((s) => (
                <li key={s.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{s.title}</p>
                    <p className="text-xs text-muted">{s.time}</p>
                  </div>
                  <button className="btn-primary !px-4 !py-2 text-xs">Join</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}