
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Building2, School, UserCog, Mail, Lock, User } from "lucide-react";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Learn, apply, get placed" },
  { id: "company", label: "Company", icon: Building2, desc: "Hire talent, post roles" },
  { id: "institution", label: "Institution", icon: School, desc: "Manage students & faculty" },
  { id: "faculty", label: "Faculty", icon: UserCog, desc: "Mentor & teach" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    year: "",
    companyName: "",
    industry: "",
    website: "",
    institutionName: "",
    location: "",
    department: "",
    designation: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", { role, ...form });
    navigate(role === "student" ? "/student"
      : role === "company" ? "/company"
      : role === "institution" ? "/institution"
      : "/faculty");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="text-white flex flex-col justify-between p-10"
        style={{ background: "linear-gradient(180deg, #151235 0%, #211B4E 100%)" }}>
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">S</div>
          SkillBridge
        </div>
        <div>
          <h2 className="text-2xl font-extrabold mb-2">Create your account</h2>
          <p className="text-[#9791C4] italic">"Your skills, our platform, a better tomorrow."</p>
        </div>
        <div className="h-40 bg-white/5 rounded-xl2" />
      </div>

      <div className="flex flex-col justify-center px-10 md:px-16 py-10 bg-white overflow-y-auto">
        <h2 className="text-2xl font-extrabold mb-1">Join SkillBridge</h2>
        <p className="text-muted mb-6">Select your role to get started</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`text-left rounded-xl2 border p-4 transition ${
                role === r.id
                  ? "border-primary bg-[#EEF0FD]"
                  : "border-line bg-white hover:border-primary/40"
              }`}
            >
              <r.icon size={20} className={role === r.id ? "text-primary" : "text-muted"} />
              <p className="text-sm font-semibold mt-2 text-[#1E1B33]">{r.label}</p>
              <p className="text-xs text-muted">{r.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex items-center gap-2 border border-line rounded-xl px-3 py-3">
            <User size={16} className="text-muted" />
            <input
              className="outline-none text-sm w-full"
              placeholder={role === "company" ? "Contact person name" : role === "institution" ? "Admin name" : "Full name"}
              value={form.name}
              onChange={update("name")}
              required
            />
          </label>

          <label className="flex items-center gap-2 border border-line rounded-xl px-3 py-3">
            <Mail size={16} className="text-muted" />
            <input
              className="outline-none text-sm w-full"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
            />
          </label>

          <label className="flex items-center gap-2 border border-line rounded-xl px-3 py-3">
            <Lock size={16} className="text-muted" />
            <input
              className="outline-none text-sm w-full"
              placeholder="Create a password"
              type="password"
              value={form.password}
              onChange={update("password")}
              required
            />
          </label>

          {role === "student" && (
            <>
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                placeholder="College / University name"
                value={form.college}
                onChange={update("college")}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Course (e.g. B.Tech CSE)"
                  value={form.course}
                  onChange={update("course")}
                  required
                />
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Year (e.g. 3rd Year)"
                  value={form.year}
                  onChange={update("year")}
                  required
                />
              </div>
            </>
          )}

          {role === "company" && (
            <>
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                placeholder="Company name"
                value={form.companyName}
                onChange={update("companyName")}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Industry (e.g. IT Services)"
                  value={form.industry}
                  onChange={update("industry")}
                  required
                />
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Website"
                  value={form.website}
                  onChange={update("website")}
                />
              </div>
            </>
          )}

          {role === "institution" && (
            <>
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                placeholder="Institution name"
                value={form.institutionName}
                onChange={update("institutionName")}
                required
              />
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                placeholder="Location (city, state)"
                value={form.location}
                onChange={update("location")}
                required
              />
            </>
          )}

          {role === "faculty" && (
            <>
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                placeholder="Institution name"
                value={form.institutionName}
                onChange={update("institutionName")}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Department (e.g. CSE)"
                  value={form.department}
                  onChange={update("department")}
                  required
                />
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none"
                  placeholder="Designation (e.g. Professor)"
                  value={form.designation}
                  onChange={update("designation")}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary justify-center mt-2">
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}