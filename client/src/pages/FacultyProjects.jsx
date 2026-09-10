import { useState, useEffect } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  ChevronDown,
  Loader2,
  Sparkles,
  Users,
  ShieldCheck,
  Building,
  GraduationCap,
  Star,
  Send,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";
import api from "../services/api";

export default function FacultyProjects() {
  const user = getCurrentUser();
  const displayName = user?.name || "Dr. Rajesh Verma";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [grade, setGrade] = useState("A+");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSupervisedProjects();
  }, []);

  const fetchSupervisedProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects/faculty/supervised");
      if (res.data?.projects) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error("Failed to load supervised projects:", err);
      // Fallback demo live industry projects
      setProjects([
        {
          _id: "proj-1",
          title: "Autonomous Logistics Delivery Route Optimizer",
          description: "Enterprise multi-depot routing engine utilizing graph heuristics, Mapbox APIs, and React/Node microservices.",
          postedBy: { companyName: "TechNova Logistics", name: "Vikram Malhotra" },
          status: "in-progress",
          assignedStudents: [
            { name: "Aarav Sharma", email: "aarav@jec.edu" },
            { name: "Priya Sharma", email: "priya@jec.edu" },
          ],
          milestones: [
            { title: "M1: Architecture Blueprint & OpenAPI Specs", status: "completed" },
            { title: "M2: Heuristic Dispatching Core Engine", status: "submitted", studentNotes: "Completed TSP/VRP solver and benchmarking suite." },
            { title: "M3: Production Integration & CI/CD", status: "pending" },
          ],
          skillsAwarded: [
            { skill: { name: "Distributed Systems" }, level: 90 },
            { skill: { name: "Node.js Microservices" }, level: 88 },
          ],
        },
        {
          _id: "proj-2",
          title: "Edge AI Defect Detection for Semiconductor Wafers",
          description: "Real-time computer vision inference on wafer silicon microscopy with ONNX runtime and lightweight WebAssembly dashboards.",
          postedBy: { companyName: "InnovateAI Microelectronics", name: "Dr. Ananya Ray" },
          status: "assigned",
          assignedStudents: [
            { name: "Rohan Verma", email: "rohan@jec.edu" },
          ],
          milestones: [
            { title: "M1: Dataset curation & YOLOv8 model training", status: "completed" },
            { title: "M2: WebAssembly pipeline benchmark", status: "in-progress" },
          ],
          skillsAwarded: [
            { skill: { name: "Computer Vision" }, level: 92 },
            { skill: { name: "TensorFlow" }, level: 85 },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOff = async (e) => {
    e.preventDefault();
    if (!activeModalProject) return;

    try {
      setSubmitting(true);
      setError("");

      await api.post(`/projects/${activeModalProject._id}/co-guide-rating`, {
        grade,
        academicFeedback: feedback || "Approved with high academic rigor and verified milestone outcomes.",
      });

      setNotification(`Official Academic Sign-off and Grade ${grade} awarded to students!`);
      setActiveModalProject(null);
      setFeedback("");
      setTimeout(() => setNotification(""), 4500);

      fetchSupervisedProjects();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit academic sign-off.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-[#F4F5FB] dark:bg-[#0E0C22] min-h-screen text-[#1E1B33] dark:text-[#F3F4F6]">
      <Sidebar
        brand={displayName}
        subtitle="Faculty Mentor"
        items={facultyItems}
        active="Live Industry Projects"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search student projects, industry partners..." />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 flex-1 min-w-0 max-w-7xl mx-auto w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#1E1B33] dark:text-white">
                  Faculty + Industry Joint Project Supervision
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
                  <GraduationCap size={12} /> Closed-Loop Academic Sign-Off
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted dark:text-gray-400">
                Co-mentor student cohorts on corporate problem statements, audit milestone deliverables, and issue official OBE outcome sign-offs.
              </p>
            </div>
          </div>

          {notification && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-xl px-4 py-2.5 mb-6 shadow-sm border border-emerald-200">
              <CheckCircle2 size={16} />
              <span>{notification}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-xl px-4 py-2.5 mb-6 shadow-sm border border-rose-200">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Project List */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-muted gap-2">
              <Loader2 className="animate-spin text-primary" size={28} />
              <p className="text-xs">Loading live industry projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No industry projects assigned yet"
              message="When corporate partners route problem statements to your department, they will appear here for academic supervision."
            />
          ) : (
            <div className="space-y-6">
              {projects.map((proj) => {
                const companyName = proj.postedBy?.companyName || proj.postedBy?.name || "Corporate Partner";
                const students = proj.assignedStudents || [];

                return (
                  <div
                    key={proj._id}
                    className="border border-[#ECEBF5] dark:border-white/10 rounded-2xl p-6 bg-white dark:bg-[#151230] shadow-sm hover:border-primary/40 transition"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-bold text-[#1E1B33] dark:text-white">
                            {proj.title}
                          </h3>
                          <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {proj.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted dark:text-gray-400 flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Building size={12} /> {companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {students.length} Student Mentee{students.length !== 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveModalProject(proj);
                            setFeedback(`Evaluated milestone execution for ${proj.title}. Rigorous implementation complying with NBA Outcome-Based Education standards.`);
                          }}
                          className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Star size={13} /> Academic Sign-Off & Review
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Milestones Track */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
                        Project Milestones & Delivery Status
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {(proj.milestones || []).map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181534] flex items-center justify-between"
                          >
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate mr-2">
                              {m.title}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                m.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : m.status === "submitted"
                                  ? "bg-sky-100 text-sky-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Students Roster */}
                    {students.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
                        <span className="text-muted font-medium">Cohort Mentees:</span>
                        {students.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded"
                          >
                            <Users size={11} /> {s.name || s.email}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Academic Co-Guide Rating Modal */}
          {activeModalProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-[#181534] border border-[#ECEBF5] dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1E1B33] dark:text-white">
                      Official Academic & Industry Sign-Off
                    </h3>
                    <p className="text-xs text-muted">{activeModalProject.title}</p>
                  </div>
                  <button
                    onClick={() => setActiveModalProject(null)}
                    className="text-muted hover:text-slate-900 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSignOff} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                      Academic Performance Grade
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full border border-[#ECEBF5] dark:border-white/10 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#151230] text-[#1E1B33] dark:text-white outline-none"
                    >
                      <option value="A+ (Distinction - 95%)">A+ (Distinction - 95%)</option>
                      <option value="A (Excellent - 88%)">A (Excellent - 88%)</option>
                      <option value="B+ (Very Good - 80%)">B+ (Very Good - 80%)</option>
                      <option value="B (Good - 75%)">B (Good - 75%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                      Faculty Academic Evaluation & Industry Endorsement
                    </label>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full border border-[#ECEBF5] dark:border-white/10 rounded-xl p-3 text-xs bg-white dark:bg-[#151230] text-[#1E1B33] dark:text-white outline-none"
                      placeholder="Enter constructive remarks on student engineering depth and milestone fulfillment..."
                      required
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 text-[11px] text-purple-900 dark:text-purple-200">
                    💡 <span className="font-bold">Closed-Loop Certification:</span> This sign-off automatically awards verified skill badges to the assigned students' Skill Passports with an AI Faculty hash.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary !px-5 !py-2 text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      {submitting && <Loader2 size={12} className="animate-spin" />}
                      {submitting ? "Signing Off..." : "Record Official Sign-Off"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
