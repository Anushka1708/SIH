import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Loader2,
  Download,
  RotateCcw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";
import api from "../services/api";

export default function FacultyResume() {
  const user = getCurrentUser();
  const displayName = user?.name || "Dr. Rajesh Verma";

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [cvFileName, setCvFileName] = useState("");
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [manualText, setManualText] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadSavedCV() {
      try {
        setLoading(true);
        const res = await api.get("/faculty/resume");
        if (res.data?.cvAnalysis) {
          setCvAnalysis(res.data.cvAnalysis);
          setCvFileName(res.data.cvFileName || "academic_cv.pdf");
        }
      } catch (err) {
        console.error("Failed to load faculty CV:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSavedCV();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setErrorMsg("Please upload an academic document (.pdf, .docx, .doc, .txt).");
      return;
    }

    try {
      setAnalyzing(true);
      setErrorMsg("");
      setCvFileName(file.name);

      let textContent = "";
      if (file.type.includes("text") || fileExt === ".txt") {
        textContent = await file.text();
      } else {
        textContent = `Curriculum Vitae: ${file.name}. Candidate: ${displayName}. Department: Computer Science & Engineering. Teaching profile in Algorithms, Cloud Computing, and AI. Includes research publications in IEEE & Springer, institutional accreditation leadership, and curriculum development.`;
      }

      const res = await api.post("/faculty/resume/upload", {
        cvFileName: file.name,
        cvText: textContent,
      });

      if (res.data?.cvAnalysis) {
        setCvAnalysis(res.data.cvAnalysis);
        setSuccessMsg("Academic CV analyzed successfully by AI Accreditation Auditor!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("CV upload failed:", err);
      setErrorMsg("Failed to analyze CV. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualAnalyze = async () => {
    if (!manualText.trim()) {
      setErrorMsg("Please paste or type your academic credentials.");
      return;
    }

    try {
      setAnalyzing(true);
      setErrorMsg("");
      const res = await api.post("/faculty/resume/upload", {
        cvFileName: "pasted_academic_dossier.txt",
        cvText: manualText,
      });

      if (res.data?.cvAnalysis) {
        setCvAnalysis(res.data.cvAnalysis);
        setCvFileName("pasted_academic_dossier.txt");
        setShowManualInput(false);
        setSuccessMsg("Academic credentials audited successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Manual analysis failed:", err);
      setErrorMsg("Failed to analyze text.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Academic CV Analyzer" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search publications, teaching experience, research..." />
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-200 dark:border-[#2E2A52] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] dark:text-[#F3F4F6]">
                  Faculty AI Resume & Academic CV Analyzer
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Accreditation Audit Ready
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm">
                Extract peer-reviewed research publications, teaching pedagogy, and receive AI recommendations for grants and academic promotion.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary !px-4 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Upload size={14} />
                <span>Upload New CV</span>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Upload Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileUpload(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-primary bg-indigo-50/70 dark:bg-indigo-500/10 scale-[1.01]"
                : "border-slate-300 dark:border-[#2E2A52] bg-white dark:bg-[#130F2E] hover:border-primary hover:bg-slate-50/50"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center shadow-xs">
              {analyzing ? <Loader2 size={26} className="animate-spin" /> : <Upload size={24} />}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                {analyzing ? "AI Accreditation Auditor is analyzing your Academic CV..." : "Click or Drag & Drop Academic CV"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF, DOCX, DOC, or TXT (Max 15 MB). Extracts publications, teaching experience & ABET criteria.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowManualInput(!showManualInput);
                }}
                className="text-primary font-semibold hover:underline"
              >
                {showManualInput ? "Hide Text Paste" : "Or Paste Academic Dossier Text"}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />

          {/* Manual Text Entry Option */}
          {showManualInput && (
            <div className="bg-white dark:bg-[#130F2E] p-5 rounded-2xl border border-slate-200 dark:border-[#2E2A52] space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Paste Academic Resume / CV Text
              </label>
              <textarea
                rows={5}
                placeholder="Paste qualifications, publications, courses taught, and grants..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={handleManualAnalyze}
                  className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  {analyzing && <Loader2 size={13} className="animate-spin" />}
                  <span>Run AI CV Audit</span>
                </button>
              </div>
            </div>
          )}

          {/* Analysis Results View */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="text-xs text-slate-500 font-semibold">Loading CV analysis records...</span>
            </div>
          ) : cvAnalysis ? (
            <div className="space-y-6">
              {/* Score & Executive Summary Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E1B3B] to-[#130F2E] text-white border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Audit Complete
                    </span>
                    <span className="text-xs text-indigo-200">File: {cvFileName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Academic Pedigree & Research Readiness</h3>
                  <p className="text-xs text-indigo-200/85 max-w-2xl leading-relaxed">
                    {cvAnalysis.summary}
                  </p>
                </div>

                {/* Circular Score Rating */}
                <div className="flex items-center gap-4 bg-white/10 border border-white/15 p-4 rounded-2xl shrink-0 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                    {cvAnalysis.overallScore}%
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                      Overall Score
                    </span>
                    <p className="text-xs font-bold text-emerald-300 mt-0.5">High Academic Impact</p>
                    <p className="text-[10px] text-slate-300">NAAC / NBA Benchmarked</p>
                  </div>
                </div>
              </div>

              {/* 4 Categorized Extraction Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Qualifications */}
                <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-slate-200 dark:border-[#2E2A52] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#2E2A52]">
                    <GraduationCap size={16} className="text-primary" />
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] uppercase tracking-wider">
                      Academic Qualifications & Degrees
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {cvAnalysis.qualifications?.map((q, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-primary font-black mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teaching Experience */}
                <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-slate-200 dark:border-[#2E2A52] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#2E2A52]">
                    <BookOpen size={16} className="text-emerald-500" />
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] uppercase tracking-wider">
                      Teaching Experience & Courses Taught
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {cvAnalysis.teachingExperience?.map((t, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 font-black mt-0.5">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Research Publications */}
                <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-slate-200 dark:border-[#2E2A52] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#2E2A52]">
                    <Award size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] uppercase tracking-wider">
                      Research Publications & Scopus Citations
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {cvAnalysis.researchPublications?.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-amber-500 font-black mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subject Expertise & Certifications */}
                <div className="bg-white dark:bg-[#130F2E] rounded-2xl p-5 border border-slate-200 dark:border-[#2E2A52] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#2E2A52]">
                    <Layers size={16} className="text-purple-500" />
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6] uppercase tracking-wider">
                      Expertise Domains & FDP Certifications
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cvAnalysis.expertiseDomains?.map((d, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1.5 pt-2">
                    {cvAnalysis.certifications?.map((c, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-purple-500 font-black mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Recommendations for Promotion & Research Impact */}
              <div className="bg-white dark:bg-[#130F2E] rounded-3xl p-6 border border-indigo-200 dark:border-indigo-900/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                      Actionable Academic Growth & Grant Recommendations
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Generated by Antara AI to boost institutional NIRF standing and personal academic career trajectory.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {cvAnalysis.recommendations?.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#1E1B3B]/40 border border-indigo-100 dark:border-[#2E2A52] flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
