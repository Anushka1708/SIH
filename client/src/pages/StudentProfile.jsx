import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings, Mail, GraduationCap, BookMarked, CalendarDays } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, loginUser } from "../utils/auth";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Opportunities", icon: Briefcase, href: "/student/opportunities" },
  { label: "Applications", icon: FileText, href: "/student/applications" },
  { label: "Resume & Portfolio", icon: FileEdit, href: "/student/resume" },
  { label: "Learning Programs", icon: BookOpen, href: "/student/learning" },
  { label: "Settings", icon: Settings, href: "/student/settings" },
];

export default function StudentProfile() {
  const user = getCurrentUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    college: user?.college || "",
    course: user?.course || "",
    year: user?.year || "",
  });
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = () => {
    loginUser({ ...user, ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User },
    { key: "email", label: "Email", icon: Mail },
    { key: "college", label: "College / University", icon: GraduationCap },
    { key: "course", label: "Course", icon: BookMarked },
    { key: "year", label: "Year", icon: CalendarDays },
  ];

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-extrabold">Profile</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary !px-4 !py-2 text-xs"
              >
                Edit Profile
              </button>
            )}
          </div>
          <p className="text-muted text-sm mb-6">Manage your personal and academic information.</p>

          {saved && (
            <p className="text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              Profile updated successfully.
            </p>
          )}

          <div className="card">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#ECEBF5]">
              <div className="w-16 h-16 rounded-full bg-violet" />
              <div>
                <p className="font-semibold text-[#1E1B33]">{form.name || "Student Name"}</p>
                <p className="text-xs text-muted">{form.course || "Course"} · {form.year || "Year"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-muted font-medium mb-1.5 flex items-center gap-1.5">
                    <f.icon size={13} /> {f.label}
                  </label>
                  {editing ? (
                    <input
                      className="w-full border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-sm outline-none"
                      value={form[f.key]}
                      onChange={update(f.key)}
                      disabled={f.key === "email"}
                    />
                  ) : (
                    <p className="text-sm text-[#1E1B33] font-medium">{form[f.key] || "—"}</p>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="btn-primary !px-5 !py-2.5 text-xs">
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-ghost !px-5 !py-2.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}