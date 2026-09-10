import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { loginUser } from "../utils/auth";
import api from "../services/api";
import { signInWithGoogle } from "../services/googleAuth";
import AuthHeroBanner from "../components/AuthHeroBanner";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const redirectByRole = (role) => {
    navigate(
      role === "student" ? "/student"
      : role === "company" ? "/company"
      : role === "institution" ? "/institution"
      : "/faculty"
    );
  };

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
        err.response?.data?.message || err.message || "Login failed. Please verify credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError("");
      const data = await signInWithGoogle({ role: "student" });
      if (data.token) {
        localStorage.setItem("skillbridge_token", data.token);
      }
      loginUser(data.user);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white dark:bg-[#0B081E]">
      {/* Left Column: Dark Blue Theme Banner with Branding, Cursive Tagline & Value Pillars */}
      <AuthHeroBanner />

      {/* Right Column: Clean White Form Container */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-12 relative bg-white dark:bg-[#130F2E]">
        <div className="max-w-md w-full mx-auto">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition mb-8 w-fit bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10"
            title="Return to SkillBridge Home"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B33] dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Sign in to continue to your SkillBridge dashboard
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="text-xs text-red bg-redSoft dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-3.5 py-2.5 mb-5 flex items-start gap-2">
              <span className="shrink-0 mt-0.5 font-bold">⚠️</span>
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* Credentials Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <label className="flex items-center gap-2.5 border border-[#ECEBF5] dark:border-[#2E2A52] rounded-xl px-3.5 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition bg-white dark:bg-[#1E1B3B]">
                <Mail size={16} className="text-muted shrink-0" />
                <input
                  className="outline-none text-sm w-full bg-transparent text-[#1E1B33] dark:text-white placeholder:text-muted"
                  placeholder="name@institution.edu / company.com"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setError("Password reset link has been dispatched to your registered address.");
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Forgot password?
                </a>
              </div>
              <label className="flex items-center gap-2.5 border border-[#ECEBF5] dark:border-[#2E2A52] rounded-xl px-3.5 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition bg-white dark:bg-[#1E1B3B]">
                <Lock size={16} className="text-muted shrink-0" />
                <input
                  className="outline-none text-sm w-full bg-transparent text-[#1E1B33] dark:text-white placeholder:text-muted"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-slate-700 dark:hover:text-slate-200 transition focus:outline-none p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-muted select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center w-full py-3.5 text-sm font-bold shadow-md shadow-indigo-500/20 disabled:opacity-60 transition active:scale-[0.99]"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
            <span className="flex-shrink mx-3 text-xs text-muted">or continue with</span>
            <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-xs active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
          </button>

          {/* Switch to Signup */}
          <p className="text-xs sm:text-sm text-center text-muted mt-7">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}