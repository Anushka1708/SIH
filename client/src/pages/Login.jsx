import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import { getCurrentUser, loginUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    // No backend yet — check if a signed-up user with this email exists in localStorage
    const existing = getCurrentUser();

    if (existing && existing.email === form.email) {
      loginUser(existing); // keep existing role/profile data, just "log in" again
      redirectByRole(existing.role);
    } else {
      setError("No account found. Please sign up first.");
    }
  };

  const redirectByRole = (role) => {
    navigate(
      role === "student" ? "/student"
      : role === "company" ? "/company"
      : role === "institution" ? "/institution"
      : "/faculty"
    );
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
          <h2 className="text-2xl font-extrabold mb-2">Login to your account</h2>
          <p className="text-[#9791C4] italic">"Your skills, our platform, a better tomorrow."</p>
        </div>
        <div className="h-40 bg-white/5 rounded-xl2" />
      </div>

      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        <h2 className="text-2xl font-extrabold mb-1">Welcome Back!</h2>
        <p className="text-muted mb-8">Sign in to continue to your dashboard</p>

        {error && (
          <p className="text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="flex items-center gap-2 border border-[#ECEBF5] rounded-xl px-3 py-3 mb-4">
            <Mail size={16} className="text-muted" />
            <input
              className="outline-none text-sm w-full"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={update("email")}
            />
          </label>

          <label className="flex items-center gap-2 border border-[#ECEBF5] rounded-xl px-3 py-3 mb-3">
            <Lock size={16} className="text-muted" />
            <input
              className="outline-none text-sm w-full"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={update("password")}
            />
            <Eye size={16} className="text-muted" />
          </label>

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-primary font-semibold">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary justify-center mb-4 w-full">
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted mb-4 font-mono">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>

        <button className="btn-ghost justify-center mb-3">Continue with Google</button>
        <button className="btn-ghost justify-center mb-6">Continue with GitHub</button>

        <p className="text-sm text-center text-muted">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}