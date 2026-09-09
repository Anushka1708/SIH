import { useState } from "react";
import { LayoutDashboard, User, Award, Briefcase, FileText, FileEdit, BookOpen, Settings, Upload, File, X, Link as LinkIcon, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";

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

export default function StudentResume() {
  const user = getCurrentUser();
  const [resumeFile, setResumeFile] = useState(null);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={user?.name} subtitle="Student" items={items} />
      <div className="flex-1">
        <Topbar placeholder="Search opportunities, skills, courses..." />
        <div className="p-6 max-w-2xl">
          <h2 className="text-xl font-extrabold mb-1">Resume & Portfolio</h2>
          <p className="text-muted text-sm mb-6">Upload your resume and showcase your work.</p>

          <div className="card mb-6">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4">Resume</p>

            {resumeFile ? (
              <div className="flex items-center justify-between border border-[#ECEBF5] rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <File size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-[#1E1B33]">{resumeFile.name}</p>
                    <p className="text-xs text-muted">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button onClick={() => setResumeFile(null)} className="text-muted hover:text-red">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#ECEBF5] rounded-xl py-10 cursor-pointer hover:border-primary/40">
                <Upload size={22} className="text-muted" />
                <p className="text-sm text-muted">Click to upload your resume (PDF)</p>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="card">
            <p className="font-semibold text-[#1E1B33] text-sm mb-4">Portfolio Links</p>

            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-2 border border-[#ECEBF5] rounded-xl px-3 py-2.5 flex-1">
                <LinkIcon size={15} className="text-muted" />
                <input
                  className="outline-none text-sm w-full"
                  placeholder="https://github.com/yourname"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                />
              </label>
              <button onClick={handleAddLink} className="btn-primary !px-4 !py-2.5 text-xs flex items-center gap-1">
                <Plus size={14} /> Add
              </button>
            </div>

            {links.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">No links added yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {links.map((link, i) => (
                  <li key={i} className="flex items-center justify-between border border-[#ECEBF5] rounded-xl px-4 py-2.5">
                    <a href={link} target="_blank" rel="noreferrer" className="text-sm text-primary truncate">
                      {link}
                    </a>
                    <button onClick={() => handleRemoveLink(i)} className="text-muted hover:text-red">
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}