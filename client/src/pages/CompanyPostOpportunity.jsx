// import { LayoutDashboard, Send, FileText, Users, FolderKanban, BarChart3, Settings } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { getCurrentUser } from "../utils/auth";

// const items = [
//   { label: "Dashboard", icon: LayoutDashboard, href: "/company" },
//   { label: "Post Opportunity", icon: Send, href: "/company/postopportunity" },
//   { label: "Applications", icon: FileText, href: "/company/applications" },
//   { label: "Internships", icon: Users, href: "/company/internships" },
//   { label: "Projects", icon: FolderKanban, href: "/company/projects" },
//   { label: "Profile", icon: Users, href: "/company/profile" },
//   { label: "Analytics", icon: BarChart3, href: "/company/analytics" },
//   { label: "Settings", icon: Settings, href: "/company/settings" },
// ];

// export default function CompanyPostOpportunity() {
//   const user = getCurrentUser();
//   return (
//     <div className="flex bg-bg min-h-screen">
//       <Sidebar brand={user?.companyName || user?.name} subtitle="Company" items={items} />
//       <div className="flex-1">
//         <Topbar placeholder="Search candidates, skills..." />
//         <div className="p-6">
//           <h2 className="text-xl font-extrabold mb-1">Post Opportunity</h2>
//           <p className="text-muted text-sm mb-6">Create a new internship, job or project listing.</p>
//           <div className="card">
//             {/* TODO: form fields - title, type, location, stipend, required skills, description */}
//             <p className="text-sm text-muted">Form goes here.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";

export default function CompanyPostOpportunity() {
  const user = getCurrentUser();
  const displayName = user?.companyName || user?.name || "Company";
  const [form, setForm] = useState({ title: "", type: "Internship", location: "", stipend: "", skills: "", description: "" });
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New opportunity:", form);
    alert("Opportunity posted!");
    setForm({ title: "", type: "Internship", location: "", stipend: "", skills: "", description: "" });
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Company" items={companyItems} active="Post Opportunity" />
      <div className="flex-1">
        <Topbar placeholder="Search candidates, skills..." />
        <div className="p-6 max-w-2xl">
          <h2 className="text-xl font-extrabold mb-1">Post a New Opportunity</h2>
          <p className="text-muted text-sm mb-6">Reach thousands of verified students.</p>

          <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Role title (e.g. Frontend Developer Intern)" value={form.title} onChange={update("title")} required />
            <div className="grid grid-cols-2 gap-3">
              <select className="border border-line rounded-xl px-3 py-3 text-sm outline-none" value={form.type} onChange={update("type")}>
                <option>Internship</option>
                <option>Full-time</option>
                <option>Project</option>
              </select>
              <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Location (Remote / Hybrid / City)" value={form.location} onChange={update("location")} required />
            </div>
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Stipend / Salary (e.g. ₹15k/month)" value={form.stipend} onChange={update("stipend")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Required skills (comma separated)" value={form.skills} onChange={update("skills")} />
            <textarea className="border border-line rounded-xl px-3 py-3 text-sm outline-none min-h-[120px]" placeholder="Role description" value={form.description} onChange={update("description")} required />
            <button type="submit" className="btn-primary justify-center">Post Opportunity</button>
          </form>
        </div>
      </div>
    </div>
  );
}