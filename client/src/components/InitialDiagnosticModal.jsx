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
  ChevronDown,
  ShieldCheck,
  Bot,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const OPTION_LETTERS = ["A", "B", "C", "D"];

function FormattedQuestionText({ text }) {
  if (!text) return null;

  if (text.includes("```")) {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            const codeLines = part.slice(3, -3).replace(/^[a-z0-9]+\n/i, "");
            return (
              <pre
                key={index}
                className="font-mono text-xs bg-slate-900 text-emerald-400 p-3.5 rounded-xl overflow-x-auto border border-slate-800 shadow-inner my-2 leading-relaxed select-text"
              >
                <code>{codeLines.trim()}</code>
              </pre>
            );
          }
          return (
            <p key={index} className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
              {part}
            </p>
          );
        })}
      </div>
    );
  }

  if (text.includes("`")) {
    const parts = text.split(/(`[^`]+`)/g);
    return (
      <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={index}
                className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </p>
    );
  }

  if (
    text.includes("\n") &&
    (text.includes("const ") ||
      text.includes("function") ||
      text.includes("def ") ||
      text.includes("class ") ||
      text.includes("import ") ||
      text.includes("=>"))
  ) {
    const lines = text.split("\n");
    const questionHeader = lines[0];
    const codeBody = lines.slice(1).join("\n");
    return (
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
          {questionHeader}
        </p>
        <pre className="font-mono text-xs bg-slate-900 text-emerald-400 p-3.5 rounded-xl overflow-x-auto border border-slate-800 shadow-inner my-2 leading-relaxed select-text">
          <code>{codeBody.trim()}</code>
        </pre>
      </div>
    );
  }

  return (
    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] leading-relaxed">
      {text}
    </p>
  );
}

export default function InitialDiagnosticModal({ skills = [], onClose, onCompleted }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDiagnostic() {
      try {
        setLoading(true);
        setError("");
        const res = await api.post("/assessments/generate-diagnostic", { skills });
        if (isMounted) {
          if (res.data?.questions && res.data.questions.length > 0) {
            setQuestions(res.data.questions);
          } else {
            setError("Unable to generate diagnostic test. Please try again.");
          }
        }
      } catch (err) {
        console.error("Diagnostic generation failed:", err);
        if (isMounted) {
          setError("Failed to generate diagnostic assessment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadDiagnostic();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectOption = (optIdx) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optIdx,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSubmit = async () => {
    if (!isAllAnswered) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    try {
      setError("");
      setSubmitting(true);
      const res = await api.post("/assessments/submit-diagnostic", {
        questions,
        answers: selectedAnswers,
      });

      setResult(res.data);
    } catch (err) {
      console.error("Diagnostic submission failed:", err);
      setError(err.response?.data?.error || "Failed to submit diagnostic assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (result?.skills && onCompleted) {
      onCompleted(result.skills);
    } else if (onCompleted) {
      onCompleted(null);
    }
    onClose();
  };

  const currentQ = questions[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-[#130F2E] border border-[#E2E8F0] dark:border-[#2E2A52] rounded-3xl shadow-2xl overflow-hidden text-[#0F172A] dark:text-[#F3F4F6]"
      >
        {/* Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #131032 0%, #201850 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <Brain size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-black tracking-tight">
                  Initial Diagnostic Competency Assessment
                </h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  15 Questions
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                Calibrating genuine baseline skill vector derived from your uploaded resume
              </p>
            </div>
          </div>
          <button
            onClick={result ? handleFinish : onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center animate-pulse">
                  <Bot size={34} />
                </div>
                <Sparkles size={18} className="text-amber-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                  SkillBridge AI is compiling your Comprehensive Diagnostic Test...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Generating 15 baseline questions across extracted competencies:{" "}
                  <span className="font-semibold text-primary">
                    {skills.length > 0 ? skills.slice(0, 5).join(", ") : "Core Technical Stack"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Loader2 size={16} className="animate-spin" />
                <span>Calibrating question taxonomy...</span>
              </div>
            </div>
          ) : error && questions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle size={40} className="mx-auto text-rose-500" />
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
              <button onClick={onClose} className="btn-ghost !px-5 !py-2 text-xs font-bold">
                Close & Review
              </button>
            </div>
          ) : result ? (
            /* Results & Diagnostic Report Card */
            <div className="py-3 text-center space-y-5">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                  result.overallScore >= 80
                    ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30"
                    : "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-indigo-600/30"
                }`}
              >
                {result.overallScore >= 80 ? <CheckCircle2 size={44} /> : <Award size={44} />}
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <h4 className="text-3xl font-black">{result.overallScore}%</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      result.overallScore >= 80
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300"
                    }`}
                  >
                    BASELINE CALIBRATED
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Overall Score: {result.overallCorrect} of {result.totalQuestions} questions correct
                </p>
              </div>

              {/* Per-Skill Diagnostic Breakdown Matrix */}
              <div className="text-left border border-slate-200 dark:border-[#2E2A52] rounded-2xl p-4 bg-slate-50/50 dark:bg-[#1E1B3B]/40 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Competency Vector Breakdown</span>
                  <span className="text-[10px] normal-case text-muted font-normal">
                    Derived from your answers
                  </span>
                </p>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {result.skillBreakdown?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-[#130F2E] border border-slate-200 dark:border-[#2E2A52] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6]">{item.skill}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.correct}/{item.total} correct
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#0F172A] dark:text-[#F3F4F6]">
                          {item.score}%
                        </span>
                        <div>
                          {item.verified ? (
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                              Verified ✓
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-slate-400">
                              Recorded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border text-xs leading-relaxed max-w-md mx-auto text-left bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800">
                <p className="font-bold mb-1 flex items-center gap-1.5 text-primary">
                  <Bot size={15} /> AI Faculty Evaluation:
                </p>
                <p>{result.feedback}</p>
              </div>

              {/* Review Accordion */}
              <div className="text-left border-t border-slate-100 dark:border-[#2E2A52] pt-4">
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="w-full flex items-center justify-between text-xs font-bold text-primary hover:underline py-1"
                >
                  <span>{showReview ? "Hide Diagnostic Explanations" : "Review All 15 Diagnostic Questions"}</span>
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
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary mr-1.5">
                                {q.skill}
                              </span>
                              <FormattedQuestionText text={`Q${idx + 1}. ${q.question}`} />
                            </div>
                            {isCorrect ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                                <CheckCircle2 size={12} /> Correct
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center gap-1 shrink-0">
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
                  onClick={handleFinish}
                  className="btn-primary !px-8 !py-3 text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Calibrated Skill Vector & Continue
                </button>
              </div>
            </div>
          ) : (
            /* Interactive 15-Question Step Wizard */
            <div className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Progress & Pill Navigator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      Question {currentStep + 1} of {questions.length}
                    </span>
                    {currentQ?.skill && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                        {currentQ.skill}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {answeredCount} of {questions.length} Answered
                  </span>
                </div>

                {/* Step indicator grid */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentStep;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex-1 min-w-[14px] h-2 rounded-full transition-all ${
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
                  <FormattedQuestionText text={currentQ.question} />

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
        {!loading && !result && questions.length > 0 && (
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
                  onClick={handleSubmit}
                  disabled={submitting || !isAllAnswered}
                  className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{submitting ? "Evaluating Diagnostic..." : "Submit Diagnostic (15/15)"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
