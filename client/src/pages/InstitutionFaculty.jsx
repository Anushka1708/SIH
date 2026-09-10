import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { institutionItems } from "./InstitutionDashboard";

const faculty = [
  { name: "Dr. R. Sharma", dept: "CSE", designation: "Professor", students: 48 },
  { name: "Dr. A. Mehta", dept: "ECE", designation: "Associate Professor", students: 36 },
];

export default function InstitutionFaculty() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || "Institution";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Faculty" />
      <div className="flex-1">
        <Topbar placeholder="Search faculty..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Faculty</h2>
          <p className="text-muted text-sm mb-6">Faculty members across all departments.</p>

          <div className="card">
            <ul>
              {faculty.map((f) => (
                <li key={f.name} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{f.name}</p>
                    <p className="text-xs text-muted">{f.designation} · {f.dept}</p>
                  </div>
                  <span className="text-xs text-muted">{f.students} students</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}