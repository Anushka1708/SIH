import { useState, useEffect } from "react";
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function AssessmentModal({ skillEntry, onClose, onVerified }) {
  const skillId = (skillEntry.skill?._id || skillEntry.skill)?.toString();
  const skillName = skillEntry.skill?.name || "Technical Competency";
  const initialLevel = skillEntry.level || 50;

  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizSource, setQuizSource] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);

  // Fetch live quiz from Gemini AI on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchAIQuiz() {
      try {
        setLoadingQuiz(true);
        setError("");
        const res = await api.post("/assessments/generate-quiz", {
          skillName,
          currentScore: initialLevel,
        });

        if (isMounted) {
          if (res.data?.questions && res.data.questions.length > 0) {
            setQuestions(res.data.questions);
            setQuizSource(res.data.source || "gemini-3.6-flash");
          } else {
            setError("No questions received from quiz engine.");
          }
        }
      } catch (err) {
        console.error("Failed to generate quiz with AI:", err);
        if (isMounted) {
          setError("Failed to generate quiz. Please retry or check connection.");
        }
      } finally {
        if (isMounted) {
          setLoadingQuiz(false);
        }
      }
    }

    fetchAIQuiz();

    return () => {
      isMounted = false;
    };
  }, [skillName, initialLevel]);

  const handleSelectOption = (optIdx) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optIdx,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleAssessmentSubmit = async () => {
    if (!isAllAnswered) {
      setError("Please answer all 5 questions before submitting.");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      // Calculate actual score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount += 1;
        }
      });

      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      const isPassed = calculatedScore >= 80;

      // Submit evaluation to backend
      const res = await api.post("/assessments/submit-quiz", {
        skillId,
        skillName,
        totalQuestions: questions.length,
        correctCount,
        score: calculatedScore,
        answers: selectedAnswers,
      });

      setResult({
        score: calculatedScore,
        correctCount,
        total: questions.length,
        isPassed,
        feedback:
          res.data?.feedback ||
          (isPassed
            ? `Outstanding! You achieved ${calculatedScore}% in ${skillName}. Officially certified by SkillBridge AI Faculty Mentor!`
            : `You scored ${calculatedScore}%. A minimum score of 80% is required for verified status. Review the detailed explanations and retake anytime!`),
        badgeAwarded: res.data?.badgeAwarded || isPassed,
        badgeTitle: res.data?.badgeTitle || `AI-Verified ${skillName} Specialist`,
        updatedSkills: res.data?.skills || null,
      });
    } catch (err) {
      console.error("Assessment submission error:", err);
      setError(err.response?.data?.error || "Failed to submit assessment results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndApply = () => {
    if (result?.updatedSkills && onVerified) {
      onVerified(result.updatedSkills);
    } else if (onVerified) {
      onVerified(null);
    }
    onClose();
  };

  const currentQ = questions[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-3xl shadow-2xl overflow-hidden text-[#0F172A] dark:text-[#F3F4F6]"
      >
        {/* Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #16123D 0%, #221B59 100%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/40 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-sm">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold">{skillName} Competency Assessment</h3>
                {quizSource && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    {quizSource.includes("gemini") ? "Gemini AI" : "Curated"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                Passing threshold: 80% · Evaluated by AI Faculty Mentor
              </p>
            </div>
          </div>
          <button
            onClick={result ? handleCloseAndApply : onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* 1. Loading State */}
          {loadingQuiz ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center animate-pulse">
                  <Bot size={32} />
                </div>
                <Sparkles size={18} className="text-amber-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                  Gemini AI is generating your skill assessment quiz...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Synthesizing 5 technical multiple choice questions tailored specifically to{" "}
                  <span className="font-semibold text-primary">{skillName}</span>.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Loader2 size={16} className="animate-spin" />
                <span>Analyzing competency matrix...</span>
              </div>
            </div>
          ) : error && questions.length === 0 ? (
            /* Error State */
            <div className="py-10 text-center space-y-3">
              <AlertCircle size={36} className="mx-auto text-rose-500" />
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
              <button
                onClick={onClose}
                className="btn-ghost !px-4 !py-2 text-xs font-bold"
              >
                Close & Try Again
              </button>
            </div>
          ) : result ? (
            /* 2. Results & Instant Feedback Screen */
            <div className="text-center py-4 space-y-5">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                  result.isPassed
                    ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30"
                    : "bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/30"
                }`}
              >
                {result.isPassed ? <CheckCircle2 size={42} /> : <HelpCircle size={42} />}
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <h4 className="text-3xl font-black tracking-tight">{result.score}%</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      result.isPassed
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    }`}
                  >
                    {result.isPassed ? "PASSED · VERIFIED" : "ATTEMPT RECORDED"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Answered {result.correctCount} of {result.total} questions correctly
                </p>
              </div>

              {/* Digital Badge Card */}
              {result.badgeAwarded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0F172A] dark:text-[#F3F4F6]">
                        {result.badgeTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Official AI Faculty Signature added to student portfolio
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary dark:text-indigo-300 uppercase px-2 py-1 bg-white dark:bg-[#1E1B3B] rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">
                    Badge Issued
                  </span>
                </motion.div>
              )}

              {/* Feedback Note */}
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed max-w-md mx-auto text-left ${
                  result.isPassed
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                }`}
              >
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Bot size={15} /> AI Faculty Mentor Feedback:
                </p>
                <p>{result.feedback}</p>
              </div>

              {/* Question Review Accordion */}
              <div className="text-left border-t border-slate-100 dark:border-[#2E2A52] pt-4">
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="w-full flex items-center justify-between text-xs font-bold text-primary hover:underline py-1"
                >
                  <span>{showReview ? "Hide Detailed Explanations" : "Review Question Explanations"}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showReview ? "rotate-180" : ""}`}
                  />
                </button>

                {showReview && (
                  <div className="mt-3 space-y-3">
                    {questions.map((q, idx) => {
                      const userChoice = selectedAnswers[idx];
                      const isCorrect = userChoice === q.correctIndex;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-[#2E2A52] bg-slate-50/50 dark:bg-[#1E1B3B]/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">
                              Q{idx + 1}. {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Correct
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle size={12} /> Incorrect
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Your answer:{" "}
                            <span className={isCorrect ? "font-semibold text-emerald-600" : "font-semibold text-rose-500"}>
                              {q.options[userChoice] || "Unanswered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                              Correct answer: <span className="font-semibold">{q.options[q.correctIndex]}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1E1B3B] p-2 rounded-lg border border-slate-100 dark:border-[#2E2A52] mt-1">
                            <span className="font-semibold text-primary">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleCloseAndApply}
                  className="btn-primary !px-8 !py-3 text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Finish & Save to Profile
                </button>
              </div>
            </div>
          ) : (
            /* 3. Interactive Question Step Wizard */
            <div className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Progress and Question Indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {answeredCount} of {questions.length} Answered
                  </span>
                </div>

                {/* Step indicator pills */}
                <div className="flex items-center gap-1.5">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentStep;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          isCurrent
                            ? "bg-primary ring-2 ring-primary/20"
                            : isAnswered
                            ? "bg-emerald-500"
                            : "bg-slate-200 dark:bg-[#2E2A52]"
                        }`}
                        title={`Jump to Question ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Current Question Display */}
              {currentQ && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-1"
                >
                  <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
                    {currentQ.question}
                  </p>

                  <div className="space-y-2">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentStep] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-500/20 border-primary text-primary dark:text-indigo-200 font-semibold shadow-sm"
                              : "bg-slate-50 dark:bg-[#1E1B3B] border-slate-200 dark:border-[#2E2A52] text-slate-700 dark:text-[#E5E7EB] hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center transition ${
                                isSelected
                                  ? "bg-primary text-white shadow-sm"
                                  : "bg-white dark:bg-[#130F2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2E2A52]"
                              }`}
                            >
                              {OPTION_LETTERS[optIdx]}
                            </span>
                            <span>{option}</span>
                          </div>

                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        {!loadingQuiz && !result && questions.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-[#1E1B3B]/60 border-t border-[#E2E8F0] dark:border-[#2E2A52] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="btn-ghost !px-3.5 !py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {currentStep < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn-primary !px-4 !py-2 text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>Next Question</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAssessmentSubmit}
                  disabled={submitting || !isAllAnswered}
                  className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{submitting ? "Evaluating with AI..." : "Submit Assessment"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
