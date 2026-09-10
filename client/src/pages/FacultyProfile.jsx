import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";

export default function FacultyProfile() {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
    designation: user?.designation || "",
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
      <Sidebar brand={form.name || "Faculty"} subtitle="Faculty" items={facultyItems} active="Profile" />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Profile</h2>
          <p className="text-muted text-sm mb-6">Update your faculty details.</p>

          <form onSubmit={handleSave} className="card flex flex-col gap-4">
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Full name" value={form.name} onChange={update("name")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Department" value={form.department} onChange={update("department")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Designation" value={form.designation} onChange={update("designation")} />
            <input className="border border-line rounded-xl px-3 py-3 text-sm outline-none" placeholder="Email" value={form.email} onChange={update("email")} disabled />
            <button type="submit" className="btn-primary justify-center">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}