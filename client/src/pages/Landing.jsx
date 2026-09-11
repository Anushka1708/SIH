import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Handshake,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  School,
  Mail,
  CheckCircle2,
  Users,
  Check,
  TrendingUp,
  Award,
  Terminal,
  Zap,
  Layers,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser } from "../utils/auth";
import BrandLogo from "../components/BrandLogo";

const SKILL_PREVIEWS = {
  "React.js": {
    level: 92,
    badge: "92% AI-Verified",
    evidence: "Assessment Verified · Score 92/100",
    mentor: "AI Faculty Evaluation Engine",
    gap: "0% Gap (Direct Match)",
    tag: "Top 5% Cohort",
    gradient: "from-indigo-500 via-violet-500 to-cyan-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
  },
  "Node.js": {
    level: 88,
    badge: "Certified",
    evidence: "Microservices Architecture · Faculty Audited",
    mentor: "AI Mentor & Faculty Sign-off",
    gap: "0% Gap (Eligible)",
    tag: "Production Ready",
    gradient: "from-emerald-500 via-teal-500 to-cyan-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  },
  "Python AI": {
    level: 94,
    badge: "94% AI-Verified",
    evidence: "LLM Pipelines & RAG · Codebase Audited",
    mentor: "Antara AI Evaluator",
    gap: "0% Gap (Top Talent)",
    tag: "Expert Vector",
    gradient: "from-amber-400 via-orange-500 to-rose-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  },
  "Cloud DevOps": {
    level: 85,
    badge: "Certified",
    evidence: "Docker & Kubernetes CI/CD · Live Milestone",
    mentor: "Industry MoU Sign-off",
    gap: "5% Target Gap",
    tag: "High Demand",
    gradient: "from-purple-500 via-violet-500 to-indigo-400",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Evidence-Based Skill Vector",
    desc: "Move beyond keyword-stuffed resumes. Every skill claim is derived from verified assessments, faculty sign-offs, and completed projects.",
    badge: "Verified Trust",
  },
  {
    icon: Sparkles,
    title: "AI Eligibility Roadmaps",
    desc: "Powered by Antara AI. When competency gaps are identified, students receive step-by-step learning roadmaps to reach 100% eligibility.",
    badge: "AI Roadmap",
  },
  {
    icon: Handshake,
    title: "Live Industry Pipeline",
    desc: "Solve actual corporate problem statements posted by hiring partners. Students earn portfolio credentials under faculty supervision.",
    badge: "Industry MoUs",
  },
  {
    icon: BarChart3,
    title: "Explainable Match Engine",
    desc: "Transparent 0–100% competency fit scoring that compares student skill vectors directly against role requirements with exact gap breakdowns.",
    badge: "Mathematical Fit",
  },
  {
    icon: School,
    title: "NIRF & NAAC Audit Ready",
    desc: "Automated compliance metrics for accreditation bodies with departmental skill health analysis and verified placement records.",
    badge: "Accreditation",
  },
  {
    icon: Terminal,
    title: "Multi-Stakeholder Portals",
    desc: "Dedicated intuitive workspaces tailored for Students, Corporate Recruiters, Faculty Mentors, and College Placement Cells.",
    badge: "Unified Portal",
  },
];

const pillars = [
  {
    category: "For Students",
    title: "Graduate with an Audited Skill Vector, Not Just a GPA",
    description:
      "Transform academic projects, hackathons, and certifications into a recruiter-verified competency profile. Get matched to high-fit internships and receive tailored Antara AI roadmaps.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    points: [
      "Real-time skill gap detection against live job requirements",
      "One-click resume upload with automated PDF parsing",
      "Direct bidding on industry live project problem statements",
    ],
    ctaText: "Create Student Profile",
    ctaLink: "/signup?role=student",
    stat: "10K+",
    statLabel: "Active Students",
  },
  {
    category: "For Recruiters",
    title: "Zero-Noise Candidate Filtering with Explainable AI Matching",
    description:
      "Stop sifting through hundreds of unverified claims. Access pre-assessed talent whose skill levels are backed by real code repositories, hackathon outputs, and faculty validation.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    points: [
      "Mathematical match score (0–100%) for every applicant",
      "Publish live industrial projects to evaluate talent in action",
      "Direct pipeline to vetted graduates across premier institutes",
    ],
    ctaText: "Post Opportunities Free",
    ctaLink: "/signup?role=company",
    stat: "500+",
    statLabel: "Hiring Partners",
  },
  {
    category: "For Colleges & Faculty",
    title: "Bridge the Curriculum-Market Gap with Real-Time Analytics",
    description:
      "Track departmental placement readiness, mentor students on live corporate MoUs, and export one-click compliance dossiers for NAAC, NBA, and NIRF audits.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    points: [
      "Faculty sign-off workflow for project-verified skills",
      "Continuous curriculum gap detection against market hiring demand",
      "Centralized MoU and industry-sponsored lab tracking",
    ],
    ctaText: "Register Institution",
    ctaLink: "/signup?role=institution",
    stat: "200+",
    statLabel: "Universities",
  },
];

export default function Landing() {
  const user = getCurrentUser();
  const [activeSkillKey, setActiveSkillKey] = useState("React.js");

  const getHomeLink = () => {
    if (!user) return "/";
    if (user.role === "student") return "/student/dashboard";
    if (user.role === "company") return "/company/dashboard";
    if (user.role === "faculty") return "/faculty/dashboard";
    if (user.role === "institution") return "/institution/dashboard";
    return "/";
  };

  return (
    <div id="home" className="min-h-screen bg-[#F4F5FB] text-[#1E1B33] selection:bg-primary/20 selection:text-primary">
      {/* Sticky Navigation Header */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-3.5 text-white backdrop-blur-md border-b border-white/10"
        style={{ background: "rgba(19, 16, 50, 0.95)" }}
      >
        <BrandLogo to={getHomeLink()} size="default" showTagline={true} />

        {/* Smooth Scroll Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#C9C5E8]">
          <a href="#home" className="hover:text-white transition">
            Home
          </a>
          <a href="#about" className="hover:text-white transition">
            About Platform
          </a>
          <a href="#features" className="hover:text-white transition">
            Core Features
          </a>
          <a href="#pillars" className="hover:text-white transition">
            Solutions
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </div>

        {/* Header CTA Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="btn-ghost !bg-transparent !border-white/20 !text-white !px-3.5 !py-2 text-xs font-semibold hover:!bg-white/10 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup?role=student"
            className="btn-primary !px-4 !py-2 text-xs font-semibold shadow-md shadow-indigo-500/25 transition"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="text-white px-6 md:px-16 pt-16 pb-24 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #131032 0%, #1D1845 50%, #251E56 100%)" }}
      >
        {/* Glow Spheres Backdrop */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-indigo-200 mb-5 backdrop-blur-md">
                <Sparkles size={14} className="text-amber-400" />
                <span className="font-semibold">AI-Powered Academia-Industry Talent Bridge</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-5 text-white">
                Bridging Academia & Industry with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300">
                  Evidence-Based Competency
                </span>
              </h1>

              <p className="text-[#C9C5E8] text-sm md:text-base mb-8 max-w-xl leading-relaxed">
                Connect students, faculty mentors, accredited colleges, and corporate recruiters
                through verified skill vectors, AI-driven learning roadmaps, and real-world project pipelines.
              </p>

              <div className="flex flex-wrap gap-3.5 mb-10">
                <Link
                  to="/signup?role=student"
                  className="btn-primary !px-6 !py-3 text-xs md:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  Join as Student <ArrowRight size={16} />
                </Link>
                <Link
                  to="/signup?role=company"
                  className="btn-ghost !bg-white/10 !border-white/20 !text-white !px-6 !py-3 text-xs md:text-sm font-semibold hover:!bg-white/15 transition"
                >
                  For Companies / Hire Talent
                </Link>
              </div>

              {/* Verified Metrics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-2xl font-black text-white">10K+</p>
                  <p className="text-xs text-[#9791C4] mt-0.5">Verified Students</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">500+</p>
                  <p className="text-xs text-[#9791C4] mt-0.5">Hiring Partners</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">200+</p>
                  <p className="text-xs text-[#9791C4] mt-0.5">Institutions</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">94%</p>
                  <p className="text-xs text-[#9791C4] mt-0.5">Match Accuracy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Custom Interactive SkillBridge UI Mockup with Ambient Glow */}
          <div className="lg:col-span-5 relative">
            {/* Animated Ambient Glow Effects */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-tr from-indigo-600/35 to-violet-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-violet-600/35 to-pink-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative z-10"
            >
              {/* Glassmorphic Main Terminal Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-b from-white/[0.14] to-white/[0.04] backdrop-blur-2xl p-5 md:p-6 text-white space-y-4">
                {/* Mockup Window Header Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                    <span className="ml-1 text-[11px] font-bold text-slate-300 tracking-wider uppercase">
                      Antara AI Talent Engine
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-extrabold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>

                {/* Candidate Vector Snapshot */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md border border-white/20">
                        AS
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black ring-2 ring-[#131032]">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white">Aarav Sharma</h4>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                          B.Tech CSE
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-200/80">IIT Bombay · Verified Competency Vector</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-emerald-400">96% Fit</span>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">AI Talent Index</p>
                  </div>
                </div>

                {/* Live Skill Verification Score & AI Badge Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-indigo-400" />
                      Live Verified Skills & AI Badges
                    </span>
                    <span className="text-[10px] text-indigo-300 font-medium">Click skill to inspect</span>
                  </div>

                  {/* Interactive Skill Filter Chips */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.keys(SKILL_PREVIEWS).map((sk) => {
                      const item = SKILL_PREVIEWS[sk];
                      const isActive = activeSkillKey === sk;
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => setActiveSkillKey(sk)}
                          className={`px-2.5 py-1.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                            isActive
                              ? "bg-indigo-600/35 border-indigo-400/70 shadow-md ring-1 ring-indigo-400/40"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                          }`}
                        >
                          <span className="text-[11px] font-bold truncate">{sk}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Skill Dynamic Telemetry Card */}
                  <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <Award size={13} className="text-amber-400" />
                        {activeSkillKey} • {SKILL_PREVIEWS[activeSkillKey].level}% Verified
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300">
                        {SKILL_PREVIEWS[activeSkillKey].gap}
                      </span>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        key={activeSkillKey}
                        initial={{ width: 0 }}
                        animate={{ width: `${SKILL_PREVIEWS[activeSkillKey].level}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${SKILL_PREVIEWS[activeSkillKey].gradient}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-indigo-200/90 pt-0.5">
                      <span className="truncate">{SKILL_PREVIEWS[activeSkillKey].evidence}</span>
                      <span className="text-[9px] font-semibold text-slate-300 bg-white/10 px-1.5 py-0.5 rounded shrink-0 ml-1">
                        {SKILL_PREVIEWS[activeSkillKey].mentor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Industry Opportunity Matching Card Preview */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1E1B4B]/80 to-[#131032]/90 border border-indigo-500/30 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                        <Briefcase size={12} />
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200">
                        Real-Time Opportunity Match
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                      96% High Fit
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white">Full Stack AI Engineer Intern</h5>
                    <p className="text-[10px] text-indigo-200/70">TechCorp Partner Ecosystem · ₹65,000/month</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      ✓ React.js (92%)
                    </span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      ✓ Node.js (88%)
                    </span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      ✓ Python AI (94%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Top-Right AI Faculty Verification Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -top-4 -right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-1.5 text-xs font-bold"
              >
                <CheckCircle2 size={15} className="text-emerald-200" />
                <span>AI Faculty Verified</span>
              </motion.div>

              {/* Floating Bottom-Left Competency Matrix Badge */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="absolute -bottom-4 -left-3 bg-[#130F2E]/95 backdrop-blur-xl border border-indigo-400/30 p-2.5 px-3.5 rounded-2xl shadow-2xl text-white hidden sm:flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={16} className="text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] font-bold leading-tight">Instant Recruiter Fast-Track</p>
                  <p className="text-[9px] text-indigo-200/80 leading-tight">
                    Audited competency vector unlocks direct interviews.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions / Stakeholder Pillars Section */}
      <section id="pillars" className="px-6 md:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              End-to-End Solutions
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B33] mt-2 mb-3">
              Built for Every Stakeholder in Higher Education
            </h2>
            <p className="text-muted text-xs md:text-sm leading-relaxed">
              Antara harmonizes student skill readiness with recruiter expectations and accreditation compliance.
            </p>
          </div>

          <div className="space-y-16">
            {pillars.map((p, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={p.category}
                  className={`grid lg:grid-cols-12 gap-10 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Details */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <span className="inline-block text-xs font-extrabold text-primary bg-indigo-50 px-3 py-1 rounded-full mb-3">
                      {p.category}
                    </span>
                    <h3 className="text-2xl font-black text-[#1E1B33] tracking-tight mb-3">
                      {p.title}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
                      {p.description}
                    </p>

                    <ul className="space-y-2.5 mb-8">
                      {p.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-4">
                      <Link
                        to={p.ctaLink}
                        className="btn-primary !px-5 !py-2.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        {p.ctaText} <ChevronRight size={14} />
                      </Link>
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-base font-black text-slate-900 block leading-tight">
                          {p.stat}
                        </span>
                        <span className="text-[10px] text-muted font-medium block">
                          {p.statLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Card with Realistic Unsplash Photo */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <motion.div
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                      className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-slate-200 group transition-all"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Verified Platform Workflow</p>
                          <p className="text-[10px] text-muted">Audited & Validated Credentials</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Bento Grid */}
      <section id="features" className="px-6 md:px-16 py-20 bg-[#F4F5FB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B33] mt-2 mb-3">
              Everything Needed for Modern Placement & Accreditation
            </h2>
            <p className="text-muted text-xs md:text-sm">
              An intelligent, modular ecosystem replacing disjointed spreadsheets and untrusted resumes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-[#ECEBF5] shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary flex items-center justify-center font-bold shadow-xs">
                      <f.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1B33] mb-2">{f.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Platform & Architecture */}
      <section id="about" className="px-6 md:px-16 py-20 bg-white border-t border-[#ECEBF5]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              Skill Mapping & Collaboration
            </span>
            <h2 className="text-3xl font-extrabold mt-2 mb-4 text-[#1E1B33]">
              Enterprise-Grade Skill & Talent Architecture
            </h2>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
              Conventional college placement portals rely on static, unverified PDFs that recruiters find impossible to calibrate.
              Antara turns competencies into dynamic, tamper-evident vectors verified through rigorous coding evaluations,
              live corporate problem statements, and faculty sign-offs.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Tamper-Proof Evidence Level (0–100)</p>
                  <p className="text-[11px] text-muted">Backed by verifiable assessment links and project IDs.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-primary flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Mathematical Gap Analysis</p>
                  <p className="text-[11px] text-muted">Cosine-like skill vector comparison with opportunity weights.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Accredited Reporting</p>
                  <p className="text-[11px] text-muted">Export instant NAAC & NBA documentation with 100% audit trail.</p>
                </div>
              </div>
            </div>

            <Link to="/signup?role=student" className="btn-primary !px-5 !py-2.5 text-xs font-bold">
              Join the Network Today
            </Link>
          </div>

          {/* Realistic Dashboard Preview Mockup */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
              alt="Engineering Team Review"
              className="w-full h-88 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section
        className="px-6 md:px-16 py-16 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #131032 0%, #251E56 100%)" }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-black mb-3">Ready to Elevate Your Campus Talent Pipeline?</h2>
          <p className="text-indigo-200 text-xs md:text-sm mb-8 leading-relaxed">
            Join thousands of students and hundreds of recruiters using Antara to make hiring evidence-driven and fair.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup?role=student"
              className="btn-primary !px-6 !py-3 text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/25"
            >
              Join as Student
            </Link>
            <Link
              to="/signup?role=company"
              className="btn-ghost !bg-white/10 !border-white/20 !text-white !px-6 !py-3 text-xs md:text-sm font-semibold hover:!bg-white/20"
            >
              For Companies / Hire Talent
            </Link>
            <Link
              to="/signup?role=institution"
              className="btn-ghost !bg-white/10 !border-white/20 !text-white !px-6 !py-3 text-xs md:text-sm font-semibold hover:!bg-white/20"
            >
              Register Institutions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer id="contact" className="px-6 md:px-16 py-12 text-white" style={{ background: "#0E0B25" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-base text-white">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-black">
                A
              </div>
              Antara
            </div>
            <p className="text-[#9791C4] leading-relaxed">
              India's premier AI-driven skill mapping and academia-industry collaboration platform.
            </p>
          </div>

          <div>
            <p className="font-bold text-white mb-3">Quick Navigation</p>
            <ul className="space-y-2 text-[#C9C5E8]">
              <li>
                <a href="#home" className="hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">About Antara</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">Core Features</a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-white transition">Stakeholder Solutions</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-3">Stakeholder Portals</p>
            <ul className="space-y-2 text-[#C9C5E8]">
              <li><Link to="/signup?role=student" className="hover:text-white transition">Student Portal</Link></li>
              <li><Link to="/signup?role=company" className="hover:text-white transition">For Companies / Hire Talent</Link></li>
              <li><Link to="/signup?role=faculty" className="hover:text-white transition">Faculty Portal</Link></li>
              <li><Link to="/signup?role=institution" className="hover:text-white transition">Register Institutions</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-3">Contact & Support</p>
            <p className="text-[#9791C4] mb-2">Antara Enterprise · Next-Gen Talent & Competency Platform</p>
            <p className="text-[#C9C5E8] flex items-center gap-1.5">
              <Mail size={13} /> support@antara.edu.in
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#9791C4] gap-3">
          <p>© 2026 Antara Platform · All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Security Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}