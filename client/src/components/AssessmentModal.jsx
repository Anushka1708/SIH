import { useState } from "react";
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const QUESTION_BANK = {
  react: [
    {
      q: "What is the primary purpose of useEffect with an empty dependency array [] in React?",
      options: [
        "Runs on every state change",
        "Runs once immediately after the initial mount",
        "Runs only during component unmount",
        "Executes synchronously before DOM mutations",
      ],
      correct: 1,
    },
    {
      q: "Why should keys be unique among sibling elements in React lists?",
      options: [
        "To enforce CSS grid alignment",
        "To enable React reconciliation algorithm to identify changed, added, or removed items efficiently",
        "To bind DOM event listeners to the window object",
        "To trigger automatic server-side rendering",
      ],
      correct: 1,
    },
    {
      q: "Which hook should you use to preserve a mutable value across renders without triggering a re-render?",
      options: ["useState", "useMemo", "useRef", "useCallback"],
      correct: 2,
    },
  ],
  node: [
    {
      q: "How does Node.js handle asynchronous non-blocking I/O operations under the hood?",
      options: [
        "By spawning an OS process for every incoming request",
        "Via libuv event loop and thread pool",
        "Using synchronous blocking system calls",
        "Through browser Web Workers",
      ],
      correct: 1,
    },
    {
      q: "What is the primary role of middleware functions in Express.js?",
      options: [
        "To compile JSX into browser HTML",
        "To intercept, modify request/response objects, and execute downstream handlers via next()",
        "To manage MongoDB indexing schemes",
        "To compress server memory dumps",
      ],
      correct: 1,
    },
    {
      q: "Which module provides core cryptographic functionality (e.g. hashing, HMAC) in Node.js?",
      options: ["crypto", "tls", "buffer", "os"],
      correct: 0,
    },
  ],
  python: [
    {
      q: "What is the time complexity of looking up a key in a standard Python dictionary (dict) on average?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correct: 2,
    },
    {
      q: "What does the 'yield' keyword in a Python function create?",
      options: ["A recursive lock", "A generator object", "A static lambda method", "An async thread pool"],
      correct: 1,
    },
    {
      q: "Which statement best describes Python's Global Interpreter Lock (GIL)?",
      options: [
        "A mechanism allowing multi-threaded CPU-bound programs to utilize all cores simultaneously",
        "A mutex that protects access to Python objects, preventing multiple threads from executing bytecodes at once",
        "A network firewall for socket connections",
        "A garbage collection algorithm for circular references",
      ],
      correct: 1,
    },
  ],
  default: [
    {
      q: "Which architectural pattern decouples components by communicating through message events?",
      options: [
        "Monolithic Database Architecture",
        "Event-Driven Microservices Architecture",
        "Direct Synchronous Coupling",
        "Single-Threaded Polling",
      ],
      correct: 1,
    },
    {
      q: "What is the primary benefit of maintaining clean Git commit hygiene and pull request reviews in an engineering team?",
      options: [
        "Reduces server RAM consumption",
        "Ensures traceability, peer validation, and bisectability of regressions",
        "Automates DNS record updates",
        "Replaces continuous integration suites",
      ],
      correct: 1,
    },
    {
      q: "Which HTTP status code signifies that a requested resource was created successfully?",
      options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
      correct: 1,
    },
  ],
};

export default function AssessmentModal({ skillEntry, onClose, onVerified }) {
  const skillId = (skillEntry.skill?._id || skillEntry.skill)?.toString();
  const skillName = skillEntry.skill?.name || "Technical Competency";
  const skillNameLower = skillName.toLowerCase();

  let questions = QUESTION_BANK.default;
  if (skillNameLower.includes("react")) questions = QUESTION_BANK.react;
  else if (skillNameLower.includes("node")) questions = QUESTION_BANK.node;
  else if (skillNameLower.includes("python")) questions = QUESTION_BANK.python;

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSelectOption = (qIdx, optIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleAssessmentSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      setError("");
      setEvaluating(true);

      // Calculate actual score based on quiz answers
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          correctCount += 1;
        }
      });

      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      const isPassed = calculatedScore >= 80;

      // Submit evaluation to backend
      const res = await api.post("/verification/ai-evaluate", {
        skillId,
        submissionType: "assessment",
        content: `Multiple-Choice Assessment for ${skillName}. Answered ${correctCount}/${questions.length} questions correctly. Candidate Score: ${calculatedScore}%. Status: ${isPassed ? "PASSED" : "FAILED"}.`,
      });

      setSubmitted(true);
      setResult({
        score: calculatedScore,
        correctCount,
        total: questions.length,
        isPassed,
        feedback:
          isPassed
            ? `Outstanding! You achieved ${calculatedScore}% in ${skillName}. Verified by SkillBridge AI Faculty Mentor with official badge!`
            : `You scored ${calculatedScore}%. A minimum score of 80% is required for verified status. Review the recommended learning roadmaps and retake anytime!`,
      });

      if (onVerified) {
        onVerified(res.data?.profile?.skills || null);
      }
    } catch (err) {
      console.error("Assessment evaluation error:", err);
      setError("Failed to evaluate assessment. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-[#130F2E] border border-[#ECEBF5] dark:border-[#2E2A52] rounded-3xl shadow-2xl overflow-hidden text-[#1E1B33] dark:text-[#F3F4F6]"
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
              <h3 className="text-sm font-extrabold">{skillName} Competency Assessment</h3>
              <p className="text-[11px] text-indigo-200">
                Passing threshold: 80% · Evaluated by AI Faculty Mentor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted && result ? (
            <div className="text-center py-6 space-y-4">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  result.isPassed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {result.isPassed ? <CheckCircle2 size={36} /> : <HelpCircle size={36} />}
              </div>

              <div>
                <h4 className="text-2xl font-black">{result.score}%</h4>
                <p className="text-xs font-semibold text-muted dark:text-[#9CA3AF] mt-1">
                  Answered {result.correctCount} of {result.total} questions correctly
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed max-w-md mx-auto ${
                  result.isPassed
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                }`}
              >
                {result.feedback}
              </div>

              <button
                onClick={onClose}
                className="btn-primary !px-6 !py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2.5">
                  <p className="text-xs font-bold leading-snug">
                    <span className="text-primary mr-1.5">Q{qIdx + 1}.</span> {q.q}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-500/20 border-primary dark:border-primary text-primary dark:text-indigo-200 font-semibold shadow-sm"
                              : "bg-slate-50 dark:bg-[#1E1B3B] border-slate-200/80 dark:border-[#2E2A52] text-slate-700 dark:text-[#D1D5DB] hover:border-slate-300"
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="p-4 bg-slate-50 dark:bg-[#1E1B3B]/50 border-t border-slate-100 dark:border-[#2E2A52] flex items-center justify-between">
            <span className="text-xs text-muted dark:text-[#9CA3AF]">
              Answered {Object.keys(selectedAnswers).length} of {questions.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssessmentSubmit}
                disabled={evaluating || Object.keys(selectedAnswers).length < questions.length}
                className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {evaluating && <Loader2 size={13} className="animate-spin" />}
                {evaluating ? "Evaluating..." : "Submit Answers"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
