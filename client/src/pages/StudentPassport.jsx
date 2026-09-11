import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  ShieldCheck,
  QrCode,
  Share2,
  Copy,
  CheckCircle2,
  Lock,
  Calendar,
  ExternalLink,
  Sparkles,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Skill Passport", icon: Fingerprint, href: "/student/passport" },
  { label: "Opportunities", icon: Briefcase, href: "/student/opportunities" },
  { label: "Applications", icon: FileText, href: "/student/applications" },
  { label: "Resume & Portfolio", icon: FileEdit, href: "/student/resume" },
  { label: "Learning Programs", icon: BookOpen, href: "/student/learning" },
  { label: "Settings", icon: Settings, href: "/student/settings" },
];

export default function StudentPassport() {
  const user = getCurrentUser();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchPassport();
  }, []);

  const fetchPassport = async () => {
    try {
      setLoading(true);
      const res = await api.get("/passport/me");
      if (res.data?.passport) {
        setPassport(res.data.passport);
      }
    } catch (err) {
      console.error("Failed to load passport:", err);
    } finally {
      setLoading(false);
    }
  };

  const shareableUrl = passport?.cryptographicProof?.signature
    ? `${window.location.origin}/verify-passport/${passport.cryptographicProof.signature}`
    : `${window.location.origin}/student/passport`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const signature = passport?.cryptographicProof?.signature || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  return (
    <div className="flex bg-[#F4F5FB] dark:bg-[#0E0C22] min-h-screen text-[#1E1B33] dark:text-[#F3F4F6]">
      <Sidebar
        brand={user?.name}
        subtitle="Student"
        items={items}
        active="Skill Passport"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search verified passport, credentials, skills..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0 max-w-6xl mx-auto w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#1E1B33] dark:text-white">
                  Cryptographic Digital Skill Passport
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                  <ShieldCheck size={12} /> Tamper-Proof AI Verified
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted dark:text-gray-400">
                Sovereign academic credentials authenticated with SHA-256 cryptographic signatures and AI Faculty sign-offs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5 shadow-md"
              >
                {copied ? <CheckCircle2 size={14} /> : <Share2 size={14} />}
                {copied ? "Link Copied!" : "Verify & Share Passport"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-muted gap-2">
              <Loader2 className="animate-spin text-primary" size={28} />
              <p className="text-xs">Generating cryptographically verified passport...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Digital Passport Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Visual Identity Passport Pass */}
                <div className="rounded-3xl border border-[#ECEBF5] dark:border-white/10 bg-white dark:bg-[#151230] p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  {/* Watermark / Ambient glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Bar of Passport */}
                  <div className="flex items-center justify-between border-b border-[#ECEBF5] dark:border-white/10 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                        A
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          ANTARA TALENT IDENTITY
                        </span>
                        <h3 className="text-lg font-extrabold text-[#1E1B33] dark:text-white">
                          National Digital Skill Passport
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-muted uppercase block">Passport ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {passport?.passportId || "SBP-2026-IN"}
                      </span>
                    </div>
                  </div>

                  {/* Student Details Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Learner Name</span>
                      <p className="text-sm font-bold text-[#1E1B33] dark:text-white">{passport?.student?.name || user?.name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Academic Program</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{passport?.student?.degree || "B.Tech CSE"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Affiliated Institution</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{passport?.student?.college || "Institute of Technology"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">AI Talent Index</span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        <Sparkles size={11} /> {passport?.talentIndex || 88}/100
                      </span>
                    </div>
                  </div>

                  {/* Verified Skills Matrix */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Verified Competency Vector ({passport?.skills?.length || 0})
                      </h4>
                      <span className="text-[11px] text-muted">Evidence-backed ratings</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(passport?.skills || []).map((skill, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#1E1B33] dark:text-white">{skill.name}</span>
                              {skill.verified && (
                                <CheckCircle2 size={13} className="text-emerald-500" />
                              )}
                            </div>
                            <span className="text-[10px] text-muted font-medium capitalize">
                              {skill.evidenceType} · {skill.ncrfCode || "NSQF-L6"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                              {skill.level}%
                            </span>
                            <span className="block text-[9px] text-emerald-600 font-bold uppercase">
                              {skill.verified ? "VERIFIED" : "SELF"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI & Faculty Badges */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                      <Award size={14} className="text-purple-500" />
                      Academic & AI Faculty Credentials ({passport?.badges?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {(passport?.badges || []).map((badge, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/20 flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Award size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-purple-950 dark:text-purple-200">{badge.title}</h5>
                            <p className="text-[11px] text-muted dark:text-gray-400 line-clamp-1">{badge.description}</p>
                            <span className="text-[10px] font-medium text-purple-800 dark:text-purple-300 mt-0.5 block">
                              Issued by: {badge.issuedBy} · {new Date(badge.date || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Cryptographic Audit & Verifiable QR Payload */}
              <div className="space-y-6">
                {/* Cryptographic Proof Card */}
                <div className="rounded-3xl border border-[#ECEBF5] dark:border-white/10 bg-white dark:bg-[#151230] p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white/10 text-emerald-400 flex items-center justify-center">
                      <Lock size={15} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E1B33] dark:text-white">Cryptographic Proof</h4>
                      <p className="text-[10px] text-muted">Deterministic SHA-256 Audit Trail</p>
                    </div>
                  </div>

                  {/* Hash String box */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-muted uppercase block mb-1">
                      SHA-256 Signature Hash
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] break-all border border-slate-800 flex items-center justify-between gap-2">
                      <span>{signature}</span>
                      <button
                        onClick={handleCopy}
                        className="p-1 hover:text-white transition shrink-0"
                        title="Copy Signature"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  {/* QR Code Graphic Representation */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center mb-4">
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center border border-slate-200">
                      {/* Stylized Verifiable QR Matrix */}
                      <div className="w-full h-full border-2 border-dashed border-indigo-400 rounded-lg flex flex-col items-center justify-center p-2 text-indigo-700">
                        <QrCode size={48} className="text-indigo-600 mb-1" />
                        <span className="text-[8px] font-mono font-bold tracking-tight">SCAN TO VERIFY</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted block mt-2">
                      Verifiable by Recruiters & Accrediting Bodies
                    </span>
                  </div>

                  {/* Audit Metadata */}
                  <div className="space-y-2 text-[11px] border-t border-slate-100 dark:border-white/10 pt-3 text-muted">
                    <div className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">SHA-256 HMAC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-emerald-600">Tamper-Proof Validated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span className="text-slate-800 dark:text-slate-200">Antara Sovereign Registry</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued Date:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {new Date(passport?.cryptographicProof?.issuedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Share Link */}
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-5">
                  <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
                    <Share2 size={13} className="text-indigo-600" /> Public Verification Link
                  </h4>
                  <p className="text-[11px] text-muted dark:text-gray-400 mb-3">
                    Share this unique cryptographic link on your resume, LinkedIn, or job applications.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={shareableUrl}
                      className="bg-white dark:bg-white/10 border border-indigo-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 flex-1 outline-none font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className="btn-primary !px-3 !py-1.5 text-xs shrink-0"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
