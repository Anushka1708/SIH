import BrandLogo from "./BrandLogo";
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
        <BrandLogo to="/" size="default" showTagline={true} />

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

        {/* Modern High-Definition Glassmorphic EdTech & Corporate Telemetry Visual */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl space-y-4 max-w-md"
        >
          {/* Header with Connection Stream */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <p className="text-xs font-bold text-white">Academia-Corporate Pipeline</p>
                <p className="text-[10px] text-indigo-200/80">Active Campus MoUs & Match Stream</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
            </span>
          </div>

          {/* Connected Network Nodes Diagram */}
          <div className="py-2.5 px-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/40 border border-indigo-400/40 flex items-center justify-center text-white text-[11px] font-bold">
                🎓
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Student Vector</p>
                <p className="text-[9px] text-slate-300">Audited Skills</p>
              </div>
            </div>

            {/* Pulsing Connector Arrow */}
            <div className="flex items-center px-1">
              <div className="h-0.5 w-6 bg-gradient-to-r from-indigo-400 to-purple-400 relative">
                <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-white text-[11px] font-bold">
                🏛️
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Faculty Sign-off</p>
                <p className="text-[9px] text-slate-300">Accredited</p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex items-center px-1">
              <div className="h-0.5 w-6 bg-gradient-to-r from-purple-400 to-emerald-400" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-white text-[11px] font-bold">
                💼
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Enterprise Hire</p>
                <p className="text-[9px] text-emerald-300">94% Fit Match</p>
              </div>
            </div>
          </div>

          {/* Competency Gap Resolution Telemetry */}
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                <span>Distributed Systems & Cloud Architecture</span>
                <span className="font-semibold text-emerald-300">92% Match · Zero Gap</span>
              </div>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full w-[92%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                <span>Enterprise API & Live Project Problem Statements</span>
                <span className="font-semibold text-indigo-300">88% Verified Evidence</span>
              </div>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full w-[88%]" />
              </div>
            </div>
          </div>

          {/* Bottom Trust Stamp */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Evidence-Derived Skill Vector
            </span>
            <span className="text-white/80 font-medium">Google · Flipkart · TechCorp</span>
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
