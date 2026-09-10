import { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Brain,
  BookOpen,
  ArrowRight,
  Clock,
  Loader2,
  X,
  Bot,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";
import api from "../services/api";

export default function FacultyUpskilling() {
  const user = getCurrentUser();
  const displayName = user?.name || "Dr. Rajesh Verma";

  const [modules, setModules] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Quiz Modal State
  const [activeModule, setActiveModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const fetchUpskilling = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faculty/upskilling");
      if (res.data) {
        setModules(res.data.modules || []);
        setBadges(res.data.badges || []);
      }
    } catch (err) {
      console.error("Failed to load upskilling:", err);
      setError("Failed to load faculty upskilling modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpskilling();
  }, []);

  const handleStartQuiz = (mod) => {
    setActiveModule(mod);
    setCurrentStep(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setShowReview(false);
  };

  const handleSelectOption = (optIdx) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optIdx,
    }));
  };

  const currentQuestions = activeModule?.questions || [];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = currentQuestions.length > 0 && answeredCount === currentQuestions.length;

  const handleSubmitQuiz = async () => {
    if (!isAllAnswered) {
      alert(`Please answer all ${currentQuestions.length} questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/faculty/upskilling/submit-quiz", {
        moduleId: activeModule.id,
        answers: selectedAnswers,
      });

      setQuizResult(res.data);
      if (res.data?.badges) {
        setBadges(res.data.badges);
      }
      fetchUpskilling();
    } catch (err) {
      console.error("Quiz submission failed:", err);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseQuiz = () => {
    setActiveModule(null);
    setQuizResult(null);
    setSelectedAnswers({});
  };

  const currentQ = currentQuestions[currentStep];

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Upskilling & AI Quizzes" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search educator modules, pedagogy, ABET..." />
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-200 dark:border-[#2E2A52] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] dark:text-[#F3F4F6]">
                  Faculty Upskilling & Professional Educator AI Quizzes
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-400/30">
                  Accredited Pedagogy
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm">
                Master advanced pedagogical methodologies, generative AI integration, and ABET/NAAC quality standards.
              </p>
            </div>
          </div>

          {/* Badges Earned Showcase */}
          <div className="bg-gradient-to-br from-[#1E1B3B] to-[#130F2E] rounded-3xl p-6 border border-indigo-500/30 text-white shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shadow-xs">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Your AI-Verified Educator Credentials</h3>
                  <p className="text-xs text-indigo-200/80">
                    Awarded by SkillBridge AI Faculty Academy upon scoring 75%+ on competency evaluations
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                {badges.length} Certified Badges Earned
              </span>
            </div>

            {badges.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-indigo-200/80">
                You haven't earned any educator badges yet. Complete the competency quizzes below to certify your skills!
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {badges.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3 shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{b.title}</p>
                      <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={11} /> AI-Verified
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module Grid */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Specialized Educator Learning Modules & Quizzes
            </h3>

            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="text-xs text-slate-500 font-semibold">Loading upskilling curriculum...</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white dark:bg-[#130F2E] rounded-3xl p-6 border border-slate-200 dark:border-[#2E2A52] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 uppercase tracking-wider">
                          {mod.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {mod.duration}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F3F4F6]">{mod.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#2E2A52]">
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {mod.completed ? "Certified Status" : "Evaluation Progress"}
                          </span>
                          <span className="font-bold text-primary">
                            {mod.completed ? `Passed (${mod.score}%)` : `${mod.progress}%`}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              mod.completed ? "bg-emerald-500" : "bg-primary"
                            }`}
                            style={{ width: `${mod.completed ? 100 : mod.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Award size={14} className="text-amber-500" />
                          <span className="font-medium">{mod.badgeTitle}</span>
                        </div>

                        <button
                          onClick={() => handleStartQuiz(mod)}
                          className={`${
                            mod.completed
                              ? "border border-slate-200 dark:border-[#2E2A52] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B3B]"
                              : "btn-primary shadow-xs"
                          } !px-4 !py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5`}
                        >
                          <Brain size={13} />
                          <span>{mod.completed ? "Retake Quiz" : "Take AI Quiz"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faculty AI Quiz Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-[#130F2E] border border-slate-200 dark:border-[#2E2A52] rounded-3xl shadow-2xl overflow-hidden text-[#0F172A] dark:text-[#F3F4F6]">
            {/* Modal Header */}
            <div
              className="p-5 text-white flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #1E1B3B 0%, #130F2E 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-md">
                  <Brain size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm md:text-base font-black tracking-tight">{activeModule.title}</h3>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Educator Quiz
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    Evaluates pedagogical competency · 75% required for AI-Verified Badge
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseQuiz}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[72vh] overflow-y-auto">
              {quizResult ? (
                /* Results View */
                <div className="py-4 text-center space-y-5">
                  <div
                    className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                      quizResult.passed
                        ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30"
                        : "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30"
                    }`}
                  >
                    {quizResult.passed ? <CheckCircle2 size={42} /> : <AlertCircle size={42} />}
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <h4 className="text-3xl font-black">{quizResult.score}%</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          quizResult.passed
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                        }`}
                      >
                        {quizResult.passed ? "CERTIFIED" : "NEEDS REVIEW"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {quizResult.correctCount} of {quizResult.totalQuestions} Questions Correct
                    </p>
                  </div>

                  {quizResult.passed && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold space-y-1">
                      <p className="font-bold text-sm">🎉 Badge Awarded: {quizResult.badgeTitle}!</p>
                      <p>Your accreditation credential has been verified into your Faculty Profile.</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    {quizResult.feedback}
                  </p>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setShowReview(!showReview)}
                      className="btn-ghost !px-5 !py-2.5 text-xs font-bold"
                    >
                      {showReview ? "Hide Question Review" : "Review Question Explanations"}
                    </button>
                    <button
                      onClick={handleCloseQuiz}
                      className="btn-primary !px-6 !py-2.5 text-xs font-bold"
                    >
                      Done & Return
                    </button>
                  </div>

                  {/* Question Review Section */}
                  {showReview && (
                    <div className="text-left space-y-4 pt-4 border-t border-slate-200 dark:border-[#2E2A52]">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Question Analysis & Explanations
                      </h5>
                      {currentQuestions.map((q, idx) => {
                        const userChoice = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : selectedAnswers[q.id];
                        const isCorrect = userChoice === q.correctIndex;
                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border ${
                              isCorrect
                                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                                : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                            } space-y-1.5`}
                          >
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Q{idx + 1}. {q.question}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Your answer: <span className="font-semibold">{q.options[userChoice] || "None"}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                Correct: {q.options[q.correctIndex]}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1E1B3B] p-2 rounded-xl border border-slate-100 dark:border-[#2E2A52]">
                              <span className="font-bold text-primary">Pedagogical Justification:</span> {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Step-by-Step Question Wizard */
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary">
                      Question {currentStep + 1} of {currentQuestions.length}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {answeredCount} of {currentQuestions.length} Answered
                    </span>
                  </div>

                  {/* Step Pills */}
                  <div className="flex items-center gap-1.5">
                    {currentQuestions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          idx === currentStep
                            ? "bg-primary ring-2 ring-primary/30"
                            : selectedAnswers[idx] !== undefined
                            ? "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Question Text */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52]">
                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
                      {currentQ?.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ?.options?.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentStep] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-between ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-500/20 border-primary text-primary dark:text-indigo-200 ring-2 ring-primary/20"
                              : "bg-white dark:bg-[#1E1B3B]/60 border-slate-200 dark:border-[#2E2A52] text-slate-700 dark:text-slate-300 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-[#1E1B3B]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                                isSelected ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#2E2A52]">
                    <button
                      type="button"
                      disabled={currentStep === 0}
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      className="btn-ghost !px-4 !py-2 text-xs font-bold disabled:opacity-30"
                    >
                      Previous
                    </button>

                    {currentStep < currentQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.min(currentQuestions.length - 1, prev + 1))}
                        className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={submitting || !isAllAnswered}
                        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs px-6 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {submitting && <Loader2 size={13} className="animate-spin" />}
                        <span>Submit & Certify</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
