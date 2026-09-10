import { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
  Bot,
  Search,
  Filter,
  X,
  BookOpen,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";
import api from "../services/api";

export default function FacultyAssessments() {
  const user = getCurrentUser();
  const displayName = user?.name || "Dr. Rajesh Verma";

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    dueDate: "",
    totalQuestions: 10,
    status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState(null);

  // Load assessments from backend
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faculty/assessments");
      if (res.data?.assessments) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
      setError("Failed to load assessments from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setActiveId(null);
    setFormData({
      title: "",
      course: "CS301 · Algorithms",
      dueDate: "2026-11-15",
      totalQuestions: 15,
      status: "Active",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (assessment) => {
    setIsEditing(true);
    setActiveId(assessment._id);
    setFormData({
      title: assessment.title,
      course: assessment.course || "",
      dueDate: assessment.dueDate || "",
      totalQuestions: assessment.totalQuestions || 10,
      status: assessment.status || "Active",
    });
    setShowModal(true);
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter an assessment title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditing && activeId) {
        const res = await api.put(`/faculty/assessments/${activeId}`, formData);
        if (res.data?.assessments) {
          setAssessments(res.data.assessments);
        }
        setSuccessMsg("Assessment updated successfully.");
      } else {
        const res = await api.post("/faculty/assessments", formData);
        if (res.data?.assessments) {
          setAssessments(res.data.assessments);
        }
        setSuccessMsg("New assessment created and published.");
      }

      setShowModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to save assessment:", err);
      setError(err.response?.data?.error || "Failed to save assessment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      const res = await api.delete(`/faculty/assessments/${id}`);
      if (res.data?.assessments) {
        setAssessments(res.data.assessments);
      }
      setSuccessMsg("Assessment removed.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to delete assessment:", err);
      setError("Failed to delete assessment.");
    }
  };

  const handleRunAIEvaluation = async (id) => {
    try {
      setEvaluatingId(id);
      const res = await api.post(`/faculty/assessments/${id}/evaluate`);
      if (res.data?.assessments) {
        setAssessments(res.data.assessments);
      }
      setSuccessMsg(res.data?.message || "AI Faculty Evaluator completed all pending evaluations!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to run AI evaluation:", err);
      setError("AI Evaluation failed.");
    } finally {
      setEvaluatingId(null);
    }
  };

  const filteredAssessments = assessments.filter((a) => {
    const matchesFilter = filterStatus === "All" || a.status === filterStatus;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.course || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSubmissions = assessments.reduce((sum, a) => sum + (a.submissionsCount || 0), 0);
  const pendingTotal = assessments.reduce((sum, a) => sum + (a.pendingCount || 0), 0);

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Assessments" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search assessments..." />
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#2E2A52]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] dark:text-[#F3F4F6]">
                  Assessments & Evaluation Manager
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-400/30">
                  Faculty Portal
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm">
                Design course quizzes, inspect student answer vectors, and run AI batch evaluations.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="btn-primary !px-4 !py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Plus size={15} />
              <span>+ Create Assessment</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#130F2E] p-4 rounded-2xl border border-slate-200 dark:border-[#2E2A52] shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Total Quizzes</span>
              <p className="text-2xl font-black text-[#0F172A] dark:text-[#F3F4F6] mt-1">{assessments.length}</p>
            </div>
            <div className="bg-white dark:bg-[#130F2E] p-4 rounded-2xl border border-slate-200 dark:border-[#2E2A52] shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Active Tests</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {assessments.filter((a) => a.status === "Active").length}
              </p>
            </div>
            <div className="bg-white dark:bg-[#130F2E] p-4 rounded-2xl border border-slate-200 dark:border-[#2E2A52] shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Total Submissions</span>
              <p className="text-2xl font-black text-primary mt-1">{totalSubmissions}</p>
            </div>
            <div className="bg-white dark:bg-[#130F2E] p-4 rounded-2xl border border-slate-200 dark:border-[#2E2A52] shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Pending Evaluation</span>
              <p className="text-2xl font-black text-amber-500 mt-1">{pendingTotal}</p>
            </div>
          </div>

          {/* Alert Messages */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#130F2E] p-3 rounded-2xl border border-slate-200 dark:border-[#2E2A52]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E1B3B] text-xs w-full sm:w-72">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by title or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              {["All", "Active", "Draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === status
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1B3B]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Assessment List */}
          <div className="bg-white dark:bg-[#130F2E] rounded-2xl border border-[#E2E8F0] dark:border-[#2E2A52] shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="text-xs text-slate-500 font-semibold">Loading assessments...</span>
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-primary flex items-center justify-center mx-auto">
                  <ClipboardList size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No assessments found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Create a test or clear your search filter to review course evaluations.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="btn-primary !px-4 !py-2 text-xs font-bold shadow-xs"
                >
                  + Create First Assessment
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#2E2A52]">
                {filteredAssessments.map((a) => (
                  <div
                    key={a._id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-[#1E1B3B]/40 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">{a.title}</h4>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            a.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} className="text-primary" /> {a.course || "General"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Due: {a.dueDate || "Flexible"}
                        </span>
                        <span>•</span>
                        <span>{a.totalQuestions || 5} Questions</span>
                      </div>
                    </div>

                    {/* Telemetry & Action Buttons */}
                    <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                      {/* Submissions & Pending Stats */}
                      <div className="text-left md:text-right text-xs">
                        <p className="font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                          {a.submissionsCount || 0} Submissions
                        </p>
                        <p className="text-[11px] font-semibold mt-0.5">
                          {(a.pendingCount || 0) > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              {a.pendingCount} Pending Review
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ 100% Evaluated
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {(a.pendingCount || 0) > 0 && (
                          <button
                            onClick={() => handleRunAIEvaluation(a._id)}
                            disabled={evaluatingId === a._id}
                            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            title="Run AI Auto-Evaluator on all pending student submissions"
                          >
                            {evaluatingId === a._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Bot size={13} className="text-amber-300" />
                            )}
                            <span>{evaluatingId === a._id ? "Grading..." : "AI Auto-Evaluate"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(a)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E1B3B] transition"
                          title="Edit Assessment"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDeleteAssessment(a._id)}
                          className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Assessment"
                        >
                          <Trash2 size={14} />
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

      {/* Create / Edit Assessment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#130F2E] border border-slate-200 dark:border-[#2E2A52] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2E2A52]">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                {isEditing ? "Edit Assessment" : "Create New Assessment"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Quiz"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS401 · Advanced Operating Systems"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost !px-4 !py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary !px-5 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Publish Assessment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}