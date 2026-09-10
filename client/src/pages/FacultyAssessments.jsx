import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";

const assessments = [
  { title: "DSA Mid-Term", submissions: 48, pending: 3 },
  { title: "Web Dev Quiz 2", submissions: 40, pending: 0 },
];

export default function FacultyAssessments() {
  const user = getCurrentUser();
  const displayName = user?.name || "Faculty";

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Assessments" />
      <div className="flex-1">
        <Topbar placeholder="Search assessments..." />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold mb-1">Assessments</h2>
              <p className="text-muted text-sm">Track submissions and pending grading.</p>
            </div>
            <button className="btn-primary !px-4 !py-2 text-sm">+ New Assessment</button>
          </div>

          <div className="card">
            <ul>
              {assessments.map((a) => (
                <li key={a.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B33]">{a.title}</p>
                    <p className="text-xs text-muted">{a.submissions} submissions</p>
                  </div>
                  <span className={`status-pill ${a.pending > 0 ? "bg-amberSoft text-amber" : "bg-greenSoft text-green"}`}>
                    {a.pending > 0 ? `${a.pending} pending` : "All graded"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}