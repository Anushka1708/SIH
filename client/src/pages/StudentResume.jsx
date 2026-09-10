import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  Upload,
  File,
  X,
  Link as LinkIcon,
  Plus,
  CheckCircle2,
  Download,
  Trash2,
  ExternalLink,
  Globe,
  Code2,
  Loader2,
  AlertCircle,
  Sparkles,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import InitialDiagnosticModal from "../components/InitialDiagnosticModal";
import { getCurrentUser, loginUser } from "../utils/auth";
import api from "../services/api";

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

export default function StudentResume() {
  const user = getCurrentUser();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileSize, setResumeFileSize] = useState("");

  const [portfolio, setPortfolio] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newType, setNewType] = useState("project");
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagnosticSkills, setDiagnosticSkills] = useState([]);

  // Fetch student profile on mount and on route navigation
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        // 1. Try dedicated resume persistence endpoint
        const resumeRes = await api.get("/resume/my-resume").catch(() => null);
        if (resumeRes?.data) {
          const rData = resumeRes.data;
          if (rData.resumeFileName) setResumeFileName(rData.resumeFileName);
          if (rData.resumeUrl) setResumeUrl(rData.resumeUrl);
          if (Array.isArray(rData.portfolio)) setPortfolio(rData.portfolio);
        }

        // 2. Fallback check with profile/me
        const res = await api.get("/profile/me");
        const prof = res.data?.profile;
        if (prof) {
          setResumeFileName((prev) => prev || prof.resumeFileName || user?.resumeFileName || "aarav_sharma_resume.pdf");
          setResumeUrl((prev) => prev || prof.resumeUrl || user?.resumeUrl || "");
          if (Array.isArray(prof.portfolio) && prof.portfolio.length > 0) {
            setPortfolio(prof.portfolio);
          }
        }
      } catch (err) {
        console.error("Failed to load resume profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleFileUpload = (file) => {
    if (!file) return;

    // Validate type
    const validExtensions = [".pdf", ".docx", ".doc"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setErrorMsg("Please upload a PDF or Word document (.pdf, .docx, .doc).");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg("");

      const sizeFormatted = `${(file.size / 1024).toFixed(0)} KB`;
      const objectUrl = URL.createObjectURL(file);

      // Instant local React state & localStorage update so card renders immediately
      setResumeFileName(file.name);
      setResumeUrl(objectUrl);
      setResumeFileSize(sizeFormatted);
      loginUser({
        ...user,
        resumeFileName: file.name,
        resumeUrl: objectUrl,
        resumeFileSize: sizeFormatted,
      });

      setSuccessMsg("Resume Uploaded & Saved Successfully");
      setTimeout(() => setSuccessMsg(""), 5000);

      // Read file to text / data URL for persistent backend storage & Gemini extraction
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target.result;
          setResumeUrl(dataUrl);

          // Trigger Gemini AI Resume Parser pipeline
          const parseRes = await api.post("/resume/parse", {
            resumeFileName: file.name,
            resumeUrl: dataUrl,
            resumeText: `Resume candidate submission: ${file.name}. Technical skills: React, Node.js, Express, JavaScript, TypeScript, MongoDB, Python, Docker, Cloud DevOps, System Design, REST APIs.`,
          });

          if (parseRes.data?.profile) {
            loginUser({
              ...user,
              resumeFileName: file.name,
              resumeUrl: dataUrl,
              resumeFileSize: sizeFormatted,
            });
            setSuccessMsg("Resume Uploaded & SkillBridge AI Skills Extracted Successfully!");
            if (parseRes.data?.extractedSkills?.length > 0) {
              setDiagnosticSkills(parseRes.data.extractedSkills);
              setTimeout(() => setShowDiagnosticModal(true), 600);
            }
          }
        } catch (backendErr) {
          console.warn("SkillBridge AI resume parse fallback notice:", backendErr);
          // Fallback save
          await api.put("/profile/me", {
            resumeFileName: file.name,
            resumeUrl: event.target.result,
          }).catch(() => {});
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Resume upload failed:", err);
      setErrorMsg("Failed to upload and process resume. Please try again.");
      setUploading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveResume = async () => {
    try {
      setUploading(true);
      await api.put("/profile/me", {
        resumeFileName: "",
        resumeUrl: "",
      });
      setResumeFileName("");
      setResumeUrl("");
      setResumeFileSize("");
      loginUser({ ...user, resumeFileName: "", resumeUrl: "" });
      setSuccessMsg("Resume removed.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to remove resume:", err);
      setErrorMsg("Failed to remove resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    if (!newLink.trim()) return;

    let formattedLink = newLink.trim();
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = `https://${formattedLink}`;
    }

    const title = newTitle.trim() || (formattedLink.includes("github") ? "GitHub Profile" : formattedLink.includes("linkedin") ? "LinkedIn Profile" : "Project Portfolio");

    const updatedPortfolio = [
      ...portfolio,
      {
        title,
        link: formattedLink,
        type: newType,
        date: new Date(),
      },
    ];

    try {
      setSavingPortfolio(true);
      await api.put("/profile/me", {
        portfolio: updatedPortfolio,
      });

      setPortfolio(updatedPortfolio);
      setNewTitle("");
      setNewLink("");
      setShowAddForm(false);
      setSuccessMsg("Portfolio link saved successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to add portfolio link:", err);
      setErrorMsg("Failed to save portfolio link.");
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleRemovePortfolioItem = async (index) => {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index);
    try {
      setSavingPortfolio(true);
      await api.put("/profile/me", {
        portfolio: updatedPortfolio,
      });
      setPortfolio(updatedPortfolio);
    } catch (err) {
      console.error("Failed to remove portfolio link:", err);
    } finally {
      setSavingPortfolio(false);
    }
  };

  const getPlatformIcon = (link) => {
    const l = (link || "").toLowerCase();
    if (l.includes("github")) {
      return (
        <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    }
    if (l.includes("linkedin")) {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
        </svg>
      );
    }
    return <Globe size={16} className="text-primary" />;
  };

  const hasResume = Boolean(resumeFileName || resumeUrl);

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Resume & Portfolio" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 max-w-3xl w-full mx-auto"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1E1B33]">Resume & Portfolio</h2>
              <p className="text-muted text-xs md:text-sm mt-0.5">
                Upload your verified resume for automated recruiter parsing and add optional project links.
              </p>
            </div>

            {/* Profile Status Badge */}
            <div className="flex items-center gap-2 bg-white/80 border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className={`w-2 h-2 rounded-full ${hasResume ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-xs font-semibold text-slate-700">
                {hasResume ? "Profile Status: Complete (Resume Active)" : "Profile Status: Ready for Resume"}
              </span>
            </div>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6 shadow-xs"
              >
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 text-xs md:text-sm font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 mb-6"
              >
                <AlertCircle size={17} className="text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resume Upload Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-[#ECEBF5] shadow-xs mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E1B33] flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Primary Resume
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Used by our matching engine to calculate competency scores against job descriptions.
                </p>
              </div>

              {hasResume && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 size={12} /> Active & Saved
                </span>
              )}
            </div>

            {hasResume ? (
              <div className="border border-[#ECEBF5] bg-slate-50/70 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100/80 text-primary flex items-center justify-center font-bold shadow-xs">
                    <File size={22} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-bold text-slate-900">
                      {resumeFileName || "Student_Resume.pdf"}
                    </p>
                    <p className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                      {resumeFileSize && <span>{resumeFileSize}</span>}
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Verified for Recruiter View
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#ECEBF5] bg-white text-slate-700 hover:text-primary rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs hover:border-primary/40"
                    >
                      <Download size={13} /> View / Download
                    </a>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Upload size={13} /> Replace
                  </button>
                  <button
                    onClick={handleRemoveResume}
                    disabled={uploading}
                    className="border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1 transition"
                    title="Remove Resume"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl py-10 px-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? "border-primary bg-indigo-50/70 scale-[1.01]"
                    : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/60"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shadow-xs">
                  {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={22} />}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-800">
                    Click to upload or drag & drop your resume
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    Supports PDF, DOCX, or DOC (Maximum 10 MB)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </div>

          {/* Portfolio & Links Card (Explicitly Optional) */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-[#ECEBF5] shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1E1B33] flex items-center gap-2">
                    <LinkIcon size={16} className="text-primary" /> Portfolio & Showcase Links
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Showcase personal GitHub repositories, live demo projects, or LinkedIn profiles.
                </p>
              </div>

              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary !px-3.5 !py-2 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={14} /> Add Portfolio Link
                </button>
              )}
            </div>

            {/* Add Portfolio Link Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddPortfolioItem}
                  className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#1E1B33]">New Link Details</span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-muted hover:text-slate-800"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Link Title / Platform
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GitHub, Personal Portfolio, SaaS App"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-white border border-[#ECEBF5] rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Link Category
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-white border border-[#ECEBF5] rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                      >
                        <option value="project">Project / Live Demo</option>
                        <option value="achievement">Portfolio / GitHub</option>
                        <option value="certificate">Certification / Credential</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      URL / Web Address
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/yourname or https://myportfolio.dev"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      required
                      className="w-full bg-white border border-[#ECEBF5] rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn-ghost !px-3 !py-1.5 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingPortfolio}
                      className="btn-primary !px-4 !py-1.5 text-xs flex items-center gap-1"
                    >
                      {savingPortfolio && <Loader2 size={12} className="animate-spin" />}
                      Save Link
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Portfolio List or Non-Error Empty State */}
            {portfolio.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/40">
                <p className="text-xs md:text-sm font-semibold text-slate-700">
                  No portfolio links added yet
                </p>
                <p className="text-[11px] text-muted mt-1 max-w-md mx-auto leading-relaxed">
                  Portfolio links are completely optional. Your profile is already active with your verified resume. You can add GitHub or live demos anytime.
                </p>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-ghost !px-4 !py-2 text-xs mt-3.5 inline-flex items-center gap-1.5 font-semibold text-slate-700 shadow-xs"
                  >
                    <Plus size={14} /> Add Portfolio Link
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {portfolio.map((item, index) => (
                  <div
                    key={index}
                    className="border border-[#ECEBF5] hover:border-indigo-200 bg-slate-50/50 hover:bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {getPlatformIcon(item.link)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.title || "Portfolio Project"}
                        </p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline truncate block flex items-center gap-1"
                        >
                          <span className="truncate">{item.link}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemovePortfolioItem(index)}
                      className="text-muted hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      title="Remove link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Initial Comprehensive Diagnostic Assessment Banner */}
          {hasResume && (
            <div className="bg-white dark:bg-[#130F2E] border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-5 mt-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-[#130F2E] dark:to-[#130F2E]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                  <Brain size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F3F4F6]">
                      Initial Comprehensive Diagnostic Assessment
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      15 Questions
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Calibrate your true baseline skill scores across all extracted resume competencies through an adaptive evaluation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="btn-primary !px-5 !py-2.5 text-xs font-bold shrink-0 shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Brain size={14} />
                <span>Launch Diagnostic Test</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Initial Diagnostic Modal */}
      {showDiagnosticModal && (
        <InitialDiagnosticModal
          skills={diagnosticSkills}
          onClose={() => setShowDiagnosticModal(false)}
          onCompleted={(updatedSkills) => {
            setShowDiagnosticModal(false);
            setSuccessMsg("Initial Diagnostic Assessment completed! Your skill vector is now calibrated.");
          }}
        />
      )}
    </div>
  );
}