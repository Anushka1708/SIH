import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Building2, School, UserCog, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { loginUser } from "../utils/auth";
import api from "../services/api";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Learn, apply, get placed" },
  { id: "company", label: "Company", icon: Building2, desc: "Hire talent, post roles" },
  { id: "institution", label: "Institution", icon: School, desc: "Manage students & faculty" },
  { id: "faculty", label: "Faculty", icon: UserCog, desc: "Mentor & teach" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    year: "3rd Year",
    companyName: "",
    industry: "",
    website: "",
    institutionName: "",
    location: "",
    department: "",
    designation: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const course =
        role === "student"
          ? `${form.degree || "B.Tech"} ${form.branch || ""}`.trim()
          : undefined;
      const payload = { role, ...form, course };
      const res = await api.post("/auth/signup", payload);

      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("skillbridge_token", token);
      }
      loginUser({ ...form, ...user, role });

      navigate(
        role === "student" ? "/student"
        : role === "company" ? "/company"
        : role === "institution" ? "/institution"
        : "/faculty"
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="text-white flex flex-col justify-between p-10"
        style={{ background: "linear-gradient(180deg, #151235 0%, #211B4E 100%)" }}>
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg group hover:opacity-90 transition" title="Back to Home">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">S</div>
          SkillBridge
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold mb-2">Create your account</h2>
          <p className="text-[#9791C4] italic">"Your skills, our platform, a better tomorrow."</p>
        </div>
        <div className="h-40 bg-white/5 rounded-xl2" />
      </div>

      <div className="flex flex-col justify-center px-10 md:px-16 py-10 bg-white overflow-y-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition mb-6 w-fit bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-slate-200"
          title="Return to SkillBridge Home"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h2 className="text-2xl font-extrabold mb-1">Join SkillBridge</h2>
        <p className="text-muted mb-6">Select your role to get started</p>

        {error && (
          <p className="text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

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
                <div>
                  <label className="text-[11px] text-muted font-medium mb-1 block">Course / Degree</label>
                  <select
                    className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full bg-white text-[#1E1B33]"
                    value={form.degree}
                    onChange={update("degree")}
                    required
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="B.E.">B.E.</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-muted font-medium mb-1 block">Branch / Specialization</label>
                  <select
                    className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full bg-white text-[#1E1B33]"
                    value={form.branch}
                    onChange={update("branch")}
                    required
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted font-medium mb-1 block">Current Year</label>
                <select
                  className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full bg-white text-[#1E1B33]"
                  value={form.year}
                  onChange={update("year")}
                  required
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center mt-2 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}