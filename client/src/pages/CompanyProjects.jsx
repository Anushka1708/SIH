import { useState, useEffect } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Award,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";
import api from "../services/api";

const statusStyles = {
  open: "bg-indigo-50 text-indigo-700 border-indigo-200",
  assigned: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function CompanyProjects() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [awardSkillId, setAwardSkillId] = useState("");
  const [awardLevel, setAwardLevel] = useState(85);

  const [milestones, setMilestones] = useState([
    { title: "Milestone 1: Architectural Design & Setup", description: "Design schema and boilerplate." },
    { title: "Milestone 2: Core Feature Implementation", description: "Implement key functional modules." },
  ]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      const list = res.data.projects || [];
      // Filter by postedBy or show all
      const myProjects = list.filter(
        (p) => (p.postedBy?._id || p.postedBy)?.toString() === user?.id?.toString()
      );
      setProjects(myProjects.length > 0 ? myProjects : list);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        const sks = res.data.skills || [];
        setAvailableSkills(sks);
        if (sks.length > 0) {
          setSelectedSkillId(sks[0]._id);
          setAwardSkillId(sks[0]._id);
        }
      } catch (err) {
        console.error("Failed to load skills for projects:", err);
      }
    };
    fetchSkills();
  }, []);

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: `Milestone ${milestones.length + 1}`, description: "Milestone deliverable." },
    ]);
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please provide a project title and description.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        postedBy: user?.id,
        requiredSkills: selectedSkillId ? [selectedSkillId] : [],
        skillsAwarded: awardSkillId ? [{ skill: awardSkillId, level: Number(awardLevel) }] : [],
        milestones: milestones.map((m) => ({ title: m.title, description: m.description })),
      };

      await api.post("/projects", payload);

      setMessage("Live project problem statement published successfully!");
      setForm({ title: "", description: "" });
      setShowCreate(false);
      fetchProjects();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to publish live project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Projects" />
      <div className="flex-1">
        <Topbar placeholder="Search projects..." />
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-extrabold">Industry Live Projects</h2>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> {showCreate ? "Cancel" : "Post Live Project"}
            </button>
          </div>
          <p className="text-muted text-sm mb-6">
            Sponsor real-world engineering problem statements and elevate student skills upon verified completion.
          </p>

          {message && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* New Project Creation Form Modal / Card */}
          {showCreate && (
            <form onSubmit={handleCreateProject} className="card mb-6 border border-primary/20 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-[#1E1B33]">New Live Project Problem Statement</h3>

              <div>
                <label className="text-xs text-muted font-medium mb-1 block">Project Title</label>
                <input
                  className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full"
                  placeholder="e.g. Distributed Cache Implementation with Redis & Go"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted font-medium mb-1 block">Problem Statement Description</label>
                <textarea
                  rows={3}
                  className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full resize-none"
                  placeholder="Detail the technical specifications, requirements, and deliverables..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Required Prerequisite Skill</label>
                  <select
                    className="border border-line rounded-xl px-3 py-2.5 text-xs outline-none w-full bg-white"
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                  >
                    {availableSkills.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">
                    Skill Awarded on Completion (Level: {awardLevel}%)
                  </label>
                  <select
                    className="border border-line rounded-xl px-3 py-2.5 text-xs outline-none w-full bg-white"
                    value={awardSkillId}
                    onChange={(e) => setAwardSkillId(e.target.value)}
                  >
                    {availableSkills.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Milestones */}
              <div className="pt-2 border-t border-[#ECEBF5]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1E1B33]">Project Milestones</label>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Milestone
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        className="border border-line rounded-xl px-3 py-1.5 text-xs outline-none flex-1"
                        placeholder="Milestone title"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].title = e.target.value;
                          setMilestones(updated);
                        }}
                      />
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="text-rose-600 hover:text-rose-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="btn-ghost !px-4 !py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !px-5 !py-2 text-xs flex items-center gap-1.5 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  {submitting ? "Publishing..." : "Publish Project"}
                </button>
              </div>
            </form>
          )}

          <div className="card">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading company projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <EmptyState
                title="No live projects published yet"
                message="Publish your first project problem statement to collaborate with students and faculty mentors."
              />
            ) : (
              <ul className="flex flex-col divide-y divide-[#ECEBF5]">
                {projects.map((p) => {
                  const assignedCount = p.assignedStudents?.length || 0;
                  const statusClass = statusStyles[p.status] || statusStyles.open;

                  return (
                    <li key={p._id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[#1E1B33]">{p.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${statusClass}`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {assignedCount} Student{assignedCount === 1 ? "" : "s"} Assigned
                          </span>
                          {p.milestones && (
                            <span>{p.milestones.length} Milestone{p.milestones.length === 1 ? "" : "s"}</span>
                          )}
                          {p.skillsAwarded && p.skillsAwarded.length > 0 && (
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                              <Award size={12} /> Awards Verified Skill
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-700">
                          {p.assignedFaculty ? "Mentor Assigned ✓" : "Seeking Mentor"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}