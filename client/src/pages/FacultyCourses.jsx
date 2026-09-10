import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";

const courses = [
  { title: "Data Structures & Algorithms", students: 52, progress: 68 },
  { title: "Web Development", students: 40, progress: 45 },
];

export default function FacultyCourses() {
  const user = getCurrentUser();
  const displayName = user?.name || "Faculty";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Courses" />
      <div className="flex-1">
        <Topbar placeholder="Search courses..." />
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-1">Courses</h2>
          <p className="text-muted text-sm mb-6">Courses you're currently teaching.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div key={c.title} className="card">
                <p className="text-sm font-semibold text-[#1E1B33] mb-1">{c.title}</p>
                <p className="text-xs text-muted mb-3">{c.students} students enrolled</p>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="text-xs text-muted mt-1">{c.progress}% syllabus complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}