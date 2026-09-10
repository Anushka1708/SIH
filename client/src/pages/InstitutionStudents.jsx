import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { institutionItems } from "./InstitutionDashboard";

const students = [
  { name: "Priya Sharma", course: "B.Tech CSE", year: "3rd Year", placement: "Placed" },
  { name: "Rohan Verma", course: "B.Tech CSE", year: "4th Year", placement: "In Progress" },
  { name: "Sneha Patel", course: "B.Tech ECE", year: "3rd Year", placement: "Not Started" },
];
const statusStyle = { Placed: "bg-greenSoft text-green", "In Progress": "bg-amberSoft text-amber", "Not Started": "bg-bg text-muted" };

export default function InstitutionStudents() {
  const user = getCurrentUser();
  const displayName = user?.institutionName || user?.name || "Institution";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Institution" items={institutionItems} active="Students" />
      <div className="flex-1">
        <Topbar placeholder="Search students..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Students</h2>
          <p className="text-muted text-sm mb-6">All enrolled students across departments.</p>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-line">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Year</th>
                  <th className="pb-3 font-medium">Placement</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.name} className="border-b border-line last:border-none">
                    <td className="py-3 font-semibold text-[#1E1B33]">{s.name}</td>
                    <td className="py-3 text-muted">{s.course}</td>
                    <td className="py-3 text-muted">{s.year}</td>
                    <td className="py-3"><span className={`status-pill ${statusStyle[s.placement]}`}>{s.placement}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}