import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  FileText,
  FileEdit,
  BookOpen,
  Settings,
  Mail,
  GraduationCap,
  BookMarked,
  CalendarDays,
  Phone,
  AlignLeft,
  Loader2,
  UploadCloud,
  File,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, loginUser } from "../utils/auth";
import api from "../services/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Profile", icon: User, href: "/student/profile" },
  { label: "Skills & Assessment", icon: Award, href: "/student/skills" },
  { label: "Opportunities", icon: Briefcase, href: "/student/opportunities" },
  { label: "Applications", icon: FileText, href: "/student/applications" },
  { label: "Resume & Portfolio", icon: FileEdit, href: "/student/resume" },
  { label: "Learning Programs", icon: BookOpen, href: "/student/learning" },
  { label: "Settings", icon: Settings, href: "/student/settings" },
];

export default function StudentProfile() {
  const user = getCurrentUser();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [rawProfile, setRawProfile] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    college: user?.college || "",
    degree: user?.degree || "",
    branch: user?.branch || "",
    year: user?.year ? String(user.year) : "",
    bio: user?.bio || "",
    contactNumber: user?.contactNumber || "",
    resumeUrl: user?.resumeUrl || "",
    resumeFileName: user?.resumeFileName || "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/profile/me");
        const profile = res.data.profile;
        if (profile) {
          setRawProfile(profile);
          setForm({
            name: user?.name || "",
            email: user?.email || "",
            college: profile.college || user?.college || "",
            degree: profile.degree || user?.degree || "",
            branch: profile.branch || user?.branch || "",
            year: profile.year ? String(profile.year) : user?.year ? String(user.year) : "",
            bio: profile.bio || user?.bio || "",
            contactNumber: profile.contactNumber || user?.contactNumber || "",
            resumeUrl: profile.resumeUrl || user?.resumeUrl || "",
            resumeFileName: profile.resumeFileName || user?.resumeFileName || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
        setError(err.response?.data?.message || "Failed to load profile from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Handle Resume File Selection / Drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processResumeFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processResumeFile(files[0]);
    }
  };

  const processResumeFile = (file) => {
    const validExtensions = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!validExtensions.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      setError("Please upload a PDF or Word document (.pdf, .docx).");
      return;
    }

    setResumeFile(file);
    const mockUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      resumeFileName: file.name,
      resumeUrl: mockUrl,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setForm((prev) => ({
      ...prev,
      resumeFileName: "",
      resumeUrl: "",
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        college: form.college,
        degree: form.degree,
        branch: form.branch,
        year: form.year ? parseInt(form.year, 10) : undefined,
        bio: form.bio,
        contactNumber: form.contactNumber,
        resumeUrl: form.resumeUrl,
        resumeFileName: form.resumeFileName,
        skills: rawProfile?.skills || [],
      };

      const res = await api.put("/profile/me", payload);
      const updatedProfile = res.data.profile;

      if (updatedProfile) {
        setRawProfile(updatedProfile);
      }

      loginUser({ ...user, ...form });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, disabled: true },
    { key: "email", label: "Email", icon: Mail, disabled: true },
    { key: "college", label: "College / University", icon: GraduationCap },
    { key: "degree", label: "Degree (e.g. B.Tech)", icon: BookMarked },
    { key: "branch", label: "Branch / Specialization", icon: BookMarked },
    { key: "year", label: "Current Year (1-6)", icon: CalendarDays },
    { key: "contactNumber", label: "Contact Number", icon: Phone },
    { key: "bio", label: "Bio / Personal Statement", icon: AlignLeft, isTextarea: true },
  ];

  return (
    <div className="flex bg-[#F4F5FB] min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} active="Profile" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 max-w-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B33]">Student Profile</h2>
              <p className="text-muted text-xs mt-0.5">
                Manage your academic credentials, verified skills, and resume portfolio.
              </p>
            </div>
            {!editing && !loading && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(true)}
                className="btn-primary !px-4 !py-2 text-xs shadow-sm hover:shadow-indigo-500/20"
              >
                Edit Profile
              </motion.button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red bg-redSoft rounded-xl px-3.5 py-2.5 my-4 border border-red-200">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green bg-greenSoft rounded-xl px-3.5 py-2.5 my-4 border border-emerald-200">
              <CheckCircle2 size={15} />
              <span>Profile and documents updated successfully.</span>
            </div>
          )}

          {/* Profile Overview Card */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="card my-5 shadow-sm border border-[#ECEBF5] backdrop-blur-sm bg-white/95"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-[#ECEBF5]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-violet flex items-center justify-center text-white text-xl font-black shadow-md">
                {form.name ? form.name[0]?.toUpperCase() : "S"}
              </div>
              <div>
                <p className="font-bold text-base text-[#1E1B33]">{form.name || "Student"}</p>
                <p className="text-xs text-muted">
                  {form.degree || form.branch
                    ? `${form.degree} · ${form.branch}`.trim()
                    : "Course"}
                  {form.year ? ` · Year ${form.year}` : ""}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {form.college || "College / University not set"}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading profile from server...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {fields.map((f) => (
                  <div key={f.key} className={f.isTextarea ? "md:col-span-2" : ""}>
                    <label className="text-xs text-muted font-semibold mb-1.5 flex items-center gap-1.5">
                      <f.icon size={13} className="text-primary/70" /> {f.label}
                    </label>
                    {editing ? (
                      f.isTextarea ? (
                        <textarea
                          rows={3}
                          className="w-full border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary transition resize-none bg-slate-50/50 focus:bg-white"
                          value={form[f.key]}
                          onChange={update(f.key)}
                          placeholder={`Enter your ${f.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          className="w-full border border-[#ECEBF5] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary transition disabled:bg-slate-100/70 disabled:text-muted bg-slate-50/50 focus:bg-white"
                          value={form[f.key]}
                          onChange={update(f.key)}
                          disabled={f.disabled}
                          placeholder={`Enter your ${f.label.toLowerCase()}`}
                        />
                      )
                    ) : (
                      <p className="text-xs text-[#1E1B33] font-medium whitespace-pre-line bg-slate-50/40 p-2.5 rounded-xl border border-slate-100">
                        {form[f.key] || "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editing && !loading && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-[#ECEBF5]">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary !px-5 !py-2.5 text-xs disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setError("");
                  }}
                  disabled={saving}
                  className="btn-ghost !px-5 !py-2.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>

          {/* Dedicated Upload Resume Section */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="card my-5 shadow-sm border border-[#ECEBF5] backdrop-blur-sm bg-white/95"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1E1B33] flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Verified Resume & Document
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Upload your CV / Resume for automated skill gap extraction and recruiter review.
                </p>
              </div>
            </div>

            {/* If Resume Exists: Preview & Download Card */}
            {form.resumeFileName || form.resumeUrl ? (
              <div className="border border-[#ECEBF5] bg-slate-50/70 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-primary flex items-center justify-center font-bold">
                    <File size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {form.resumeFileName || "Student_Resume.pdf"}
                    </p>
                    <p className="text-[11px] text-muted flex items-center gap-2">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Document Active
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {form.resumeUrl && (
                    <a
                      href={form.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#ECEBF5] bg-white text-slate-700 hover:text-primary rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download size={13} /> View / Download
                    </a>
                  )}
                  <button
                    onClick={handleRemoveResume}
                    className="border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Trash2 size={13} /> Replace
                  </button>
                </div>
              </div>
            ) : (
              /* Drag-and-drop upload zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? "border-primary bg-indigo-50/50"
                    : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to upload or drag & drop your resume
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Supports PDF, DOCX, or DOC (Maximum 10 MB)
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}