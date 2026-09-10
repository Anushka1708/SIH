import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";

export default function CompanyProfile() {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    companyName: user?.companyName || "",
    industry: user?.industry || "",
    website: user?.website || "",
    email: user?.email || "",
  });
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    localStorage.setItem("skillbridge_user", JSON.stringify(updated));
    alert("Profile updated!");
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={form.companyName || "Company"} subtitle="Company" items={companyItems} active="Profile" />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Company Profile</h2>
          <p className="text-muted text-sm mb-6">Keep your company information up to date.</p>

          <form onSubmit={handleSave} className="card flex flex-col gap-4">
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Company name" value={form.companyName} onChange={update("companyName")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Industry" value={form.industry} onChange={update("industry")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Website" value={form.website} onChange={update("website")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Email" value={form.email} onChange={update("email")} disabled />
            <button type="submit" className="btn-primary justify-center">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}