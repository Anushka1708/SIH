import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, ArrowLeft } from "lucide-react";
import { loginUser } from "../utils/auth";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("skillbridge_token", token);
      }
      loginUser(user);
      redirectByRole(user.role);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
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
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg group hover:opacity-90 transition" title="Back to Home">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">S</div>
          SkillBridge
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold mb-2">Login to your account</h2>
          <p className="text-[#9791C4] italic">"Your skills, our platform, a better tomorrow."</p>
        </div>
        <div className="h-40 bg-white/5 rounded-xl2" />
      </div>

      <div className="flex flex-col justify-center px-10 md:px-20 py-12 bg-white relative">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition mb-6 w-fit bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-slate-200"
          title="Return to SkillBridge Home"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center mb-6 w-full disabled:opacity-60 shadow-md hover:shadow-indigo-500/20"
          >
            {loading ? "Signing in..." : "Sign In to Account"}
          </button>
        </form>

        <p className="text-sm text-center text-muted">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}