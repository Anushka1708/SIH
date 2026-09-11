import { useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplainableMatchModal({
  isOpen,
  onClose,
  opportunityTitle,
  companyName,
  matchData,
  onAddToRoadmap,
}) {
  const [addingSkill, setAddingSkill] = useState(null);
  const [addedSkills, setAddedSkills] = useState({});

  if (!isOpen || !matchData) return null;

  const score = matchData.score ?? 0;
  const matched = matchData.matched || [];
  const gaps = matchData.gaps || [];
  const detailedGaps = matchData.detailedGaps || [];
  const evidence = matchData.evidenceBreakdown || {
    assessmentCount: 2,
    projectCount: 1,
    facultySignoffCount: 1,
    selfReportedCount: 1,
    evidenceWeight: 80,
  };
  const overlap = matchData.skillOverlap || {
    matchedCount: matched.length,
    totalRequired: matched.length + gaps.length || 5,
    overlapPercentage: Math.round(
      (matched.length / Math.max(1, matched.length + gaps.length)) * 100
    ),
  };

  const handleAddGap = async (gap) => {
    try {
      const skillId = gap.skillId || gap.skillName;
      setAddingSkill(skillId);
      if (onAddToRoadmap) {
        await onAddToRoadmap(gap);
      }
      setAddedSkills((prev) => ({ ...prev, [skillId]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSkill(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-[#181534] border border-[#ECEBF5] dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#ECEBF5] dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/30 dark:from-white/5 dark:to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1B33] dark:text-white flex items-center gap-2">
                  Explainable AI Match Breakdown
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Transparent XAI
                  </span>
                </h3>
                <p className="text-xs text-muted dark:text-gray-400">
                  {opportunityTitle} · <span className="font-semibold text-slate-700 dark:text-gray-300">{companyName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Top Score Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-white/10 bg-indigo-50/40 dark:bg-white/5">
                <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Overall Match Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">
                    {score}%
                  </span>
                  <span className="text-xs text-muted dark:text-gray-400">AI Vector</span>
                </div>
                <div className="w-full bg-indigo-200/60 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 dark:border-white/10 bg-emerald-50/40 dark:bg-white/5">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  Skill Overlap
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">
                    {overlap.matchedCount}/{overlap.totalRequired}
                  </span>
                  <span className="text-xs text-muted dark:text-gray-400">
                    ({overlap.overlapPercentage}%)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-medium">
                  {matched.length} requirements met
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-100 dark:border-white/10 bg-purple-50/40 dark:bg-white/5">
                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                  Evidence Weight
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1B33] dark:text-white">
                    {evidence.evidenceWeight}%
                  </span>
                  <span className="text-xs text-muted dark:text-gray-400">Confidence</span>
                </div>
                <p className="text-[11px] text-purple-800 dark:text-purple-300 mt-2 font-medium">
                  {evidence.assessmentCount} Tests + {evidence.projectCount} Projects
                </p>
              </div>
            </div>

            {/* Match Reasoning Sentence */}
            {matchData.reasoning && (
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/60 dark:bg-indigo-950/20 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed flex items-start gap-2.5">
                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Explainable AI Reasoning: </span>
                  {matchData.reasoning}
                </div>
              </div>
            )}

            {/* Matched Verified Skills */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Matched Core Skills ({matched.length})
              </h4>
              {matched.length === 0 ? (
                <p className="text-xs text-muted italic">No overlapping skills verified yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {matched.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                    >
                      <ShieldCheck size={12} className="text-emerald-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skill Gaps with Direct Roadmap Action */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
                Missing Skill Gaps & Roadmap Action ({gaps.length})
              </h4>
              {gaps.length === 0 ? (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                  🎉 Outstanding! You meet 100% of the technical competency requirements for this role.
                </div>
              ) : (
                <div className="space-y-2">
                  {detailedGaps.map((gap, idx) => {
                    const isAdded = addedSkills[gap.skillId || gap.skillName];
                    const isBusy = addingSkill === (gap.skillId || gap.skillName);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex-wrap gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1E1B33] dark:text-white">
                              {gap.skillName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40">
                              Gap: {gap.currentLevel}% / Req: {gap.requiredLevel}%
                            </span>
                          </div>
                          <p className="text-[11px] text-muted dark:text-gray-400 mt-0.5">
                            Estimated learning time: 4-7 days on Antara Learning Roadmap.
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddGap(gap)}
                          disabled={isAdded || isBusy}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                            isAdded
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          }`}
                        >
                          {isBusy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isAdded ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <BookOpen size={12} />
                          )}
                          {isAdded ? "Added to Roadmap" : "Add to Roadmap"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Evidence Weight Confidence Summary */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[11px] text-muted dark:text-gray-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-gray-300 block">
                Evidence Weight Formula:
              </span>
              <p>
                Weights: AI-Verified Assessments (35%), Industry Live Projects (40%), Faculty Sign-Offs (15%), and Self-Reported (10%).
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#ECEBF5] dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-end">
            <button
              onClick={onClose}
              className="btn-primary !px-5 !py-2 text-xs"
            >
              Close Breakdown
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
