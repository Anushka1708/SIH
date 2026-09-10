import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuthHeroBanner() {
  return (
    <div
      className="lg:col-span-6 xl:col-span-7 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 relative overflow-hidden min-h-full select-none"
      style={{ background: "linear-gradient(155deg, #0E0B25 0%, #16123D 50%, #221B59 100%)" }}
    >
      {/* Ambient Background Glow Accents */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Logo on Left + Cursive Tagline on Right */}
      <div className="flex items-center justify-between w-full relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-lg group w-fit hover:opacity-95 transition"
          title="SkillBridge Home"
        >
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white leading-none">
              SkillBridge
            </span>
            <span className="text-white/30 text-xs font-light">|</span>
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase">
              TALENT PLATFORM
            </span>
          </div>
        </Link>

        {/* Handwritten Cursive Tagline with Curved Underline SVG */}
        <div className="flex flex-col items-end text-right">
          <span
            className="font-serif italic text-xs sm:text-sm text-indigo-200 font-medium tracking-wide"
            style={{ fontFamily: "'Caveat', 'Brush Script MT', cursive, serif" }}
          >
            Better Skills, Bigger Opportunities
          </span>
          <svg
            className="w-36 sm:w-44 h-2.5 text-indigo-400 mt-0.5"
            viewBox="0 0 170 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8C45 2.5 115 2 167 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Centerpiece: Main Header, Subtitle & Vector Mockup Graphic */}
      <div className="my-10 relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-indigo-200 mb-6 backdrop-blur-md">
          <Sparkles size={13} className="text-amber-400" />
          <span className="font-semibold tracking-wide">Next-Generation Talent Verification</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
          Your skills. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-200 to-amber-200">
            Your opportunities.
          </span>{" "}
          <br />
          Your future.
        </h1>

        <p className="text-[#C9C5E8] text-sm leading-relaxed mb-8 max-w-md">
          The evidence-based academia-industry platform connecting verified competencies directly with enterprise opportunities and accredited institutions.
        </p>

        {/* High-Tech Vector & Telemetry Mockup Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl space-y-3.5 max-w-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">Live Vector Match Engine</span>
            </div>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              92% Fit Score
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                <span>React & Node.js Architecture</span>
                <span className="font-semibold text-indigo-300">Level 90% · Verified</span>
              </div>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-[90%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                <span>Cloud DevOps Systems</span>
                <span className="font-semibold text-amber-300">Level 75% · Verified</span>
              </div>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-[75%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Faculty & Project Audited
            </span>
            <span className="text-white/70">Flipkart · TechCorp Partner</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom: 3 Value Pillars ("Learn", "Connect", "Grow") */}
      <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <div className="w-5 h-5 rounded-md bg-indigo-500/30 flex items-center justify-center text-indigo-300">
              <BookOpen size={12} />
            </div>
            <span>Learn</span>
          </div>
          <p className="text-[11px] text-[#9791C4] leading-tight">
            Personalized AI roadmaps and verified skill evidence.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <div className="w-5 h-5 rounded-md bg-purple-500/30 flex items-center justify-center text-purple-300">
              <Users size={12} />
            </div>
            <span>Connect</span>
          </div>
          <p className="text-[11px] text-[#9791C4] leading-tight">
            Direct pipeline to hiring corporate partners & live projects.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <div className="w-5 h-5 rounded-md bg-emerald-500/30 flex items-center justify-center text-emerald-300">
              <TrendingUp size={12} />
            </div>
            <span>Grow</span>
          </div>
          <p className="text-[11px] text-[#9791C4] leading-tight">
            Audited skill credentials ready for career acceleration.
          </p>
        </div>
      </div>
    </div>
  );
}
