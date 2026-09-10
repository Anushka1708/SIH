import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";

const students = [
  { name: "Priya Sharma", course: "Data Structures", score: 88 },
  { name: "Rohan Verma", course: "Web Development", score: 74 },
  { name: "Sneha Patel", course: "Data Structures", score: 92 },
];

export default function FacultyStudents() {
  const user = getCurrentUser();
  const displayName = user?.name || "Faculty";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Students" />
      <div className="flex-1">
        <Topbar placeholder="Search students..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Students</h2>
          <p className="text-muted text-sm mb-6">Students enrolled in your courses.</p>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-line">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.name} className="border-b border-line last:border-none">
                    <td className="py-3 font-semibold text-[#1E1B33]">{s.name}</td>
                    <td className="py-3 text-muted">{s.course}</td>
                    <td className="py-3 text-muted">{s.score}%</td>
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