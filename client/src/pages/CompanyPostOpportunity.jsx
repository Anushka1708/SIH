import { useState, useEffect } from "react";
import {
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";
import api from "../services/api";

export default function CompanyPostOpportunity() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";

  const [availableSkills, setAvailableSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "internship",
    location: "",
    isRemote: false,
    stipend: "",
    applicationDeadline: "",
    description: "",
  });

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [minLevel, setMinLevel] = useState(60);
  const [weight, setWeight] = useState(1.0);

  useEffect(() => {
    const fetchTaxonomySkills = async () => {
      try {
        setLoadingSkills(true);
        const res = await api.get("/skills");
        const skillsList = res.data.skills || [];
        setAvailableSkills(skillsList);
        if (skillsList.length > 0) {
          setSelectedSkillId(skillsList[0]._id);
        }
      } catch (err) {
        console.error("Failed to load skills taxonomy:", err);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchTaxonomySkills();
  }, []);

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleAddSkill = () => {
    if (!selectedSkillId) return;

    // Avoid duplicate skill in requirements
    if (requiredSkills.some((s) => s.skill === selectedSkillId)) {
      setError("This skill is already added to required skills.");
      return;
    }

    const foundSkill = availableSkills.find((s) => s._id === selectedSkillId);
    setRequiredSkills([
      ...requiredSkills,
      {
        skill: selectedSkillId,
        name: foundSkill ? foundSkill.name : "Skill",
        minLevel: Number(minLevel),
        weight: Number(weight),
      },
    ]);
    setError("");
  };

  const handleRemoveSkill = (skillId) => {
    setRequiredSkills(requiredSkills.filter((s) => s.skill !== skillId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      setError("Please fill in role title and description.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        type: form.type,
        location: form.location.trim(),
        isRemote: form.isRemote,
        stipend: form.stipend.trim(),
        applicationDeadline: form.applicationDeadline || undefined,
        description: form.description.trim(),
        requiredSkills: requiredSkills.map((rs) => ({
          skill: rs.skill,
          minLevel: rs.minLevel,
          weight: rs.weight,
        })),
      };

      const res = await api.post("/opportunities", payload);

      setSuccess("Opportunity posted successfully! It is now live on the student portal.");
      setForm({
        title: "",
        type: "internship",
        location: "",
        isRemote: false,
        stipend: "",
        applicationDeadline: "",
        description: "",
      });
      setRequiredSkills([]);

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Failed to post opportunity:", err);
      setError(err.response?.data?.message || "Failed to post opportunity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        brand={displayName}
        subtitle="Company"
        items={companyItems}
        active="Post Opportunity"
      />
      <div className="flex-1">
        <Topbar placeholder="Search candidates, skills..." />
        <div className="p-6 max-w-2xl">
          <h2 className="text-xl font-extrabold mb-1">Post a New Opportunity</h2>
          <p className="text-muted text-sm mb-6">
            Reach thousands of verified students with evidence-based competency matching.
          </p>

          {success && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted font-medium mb-1 block">Role Title</label>
              <input
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                placeholder="e.g. Frontend Developer Intern"
                value={form.title}
                onChange={update("title")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted font-medium mb-1 block">Role Type</label>
                <select
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full bg-white capitalize"
                  value={form.type}
                  onChange={update("type")}
                >
                  <option value="internship">Internship</option>
                  <option value="job">Full-time Job</option>
                  <option value="project">Live Project</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted font-medium mb-1 block">Location</label>
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                  placeholder="e.g. Bangalore / Remote"
                  value={form.location}
                  onChange={update("location")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted font-medium mb-1 block">
                  Stipend / CTC
                </label>
                <input
                  className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                  placeholder="e.g. ₹25,000/month"
                  value={form.stipend}
                  onChange={update("stipend")}
                />
              </div>

              <div>
                <label className="text-xs text-muted font-medium mb-1 block">
                  Application Deadline
                </label>
                <input
                  type="date"
                  className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full"
                  value={form.applicationDeadline}
                  onChange={update("applicationDeadline")}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isRemote"
                checked={form.isRemote}
                onChange={update("isRemote")}
                className="rounded text-primary focus:ring-0"
              />
              <label htmlFor="isRemote" className="text-xs text-[#1E1B33] font-medium cursor-pointer">
                This is a remote position
              </label>
            </div>

            {/* Required Skills Section */}
            <div className="border-t border-b border-[#ECEBF5] py-4 my-1">
              <label className="text-xs font-bold text-[#1E1B33] mb-1.5 block">
                Required Skills & Thresholds
              </label>
              <p className="text-[11px] text-muted mb-3">
                Specify skills and minimum proficiency levels used by the AI matching engine.
              </p>

              {requiredSkills.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {requiredSkills.map((rs) => (
                    <div
                      key={rs.skill}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">{rs.name}</span>
                        <span className="text-muted">Min: {rs.minLevel}%</span>
                        <span className="text-muted">Weight: {rs.weight}x</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(rs.skill)}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <div className="md:col-span-2">
                  <label className="text-[11px] text-muted mb-1 block">Skill</label>
                  <select
                    className="border border-line rounded-xl px-2.5 py-2 text-xs outline-none w-full bg-white"
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    disabled={loadingSkills || availableSkills.length === 0}
                  >
                    {availableSkills.map((sk) => (
                      <option key={sk._id} value={sk._id}>
                        {sk.name} ({sk.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-muted mb-1 block">
                    Min Level: {minLevel}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={minLevel}
                    onChange={(e) => setMinLevel(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn-ghost w-full !py-2 text-xs flex items-center justify-center gap-1"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted font-medium mb-1 block">
                Job / Project Description
              </label>
              <textarea
                className="border border-line rounded-xl px-3 py-3 text-sm outline-none min-h-[120px] w-full resize-none"
                placeholder="Describe the responsibilities, project scope, and what candidates will work on..."
                value={form.description}
                onChange={update("description")}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary justify-center flex items-center gap-2 disabled:opacity-60 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Publishing Opportunity...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Publish Opportunity</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}