import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, loginUser } from "../utils/auth";
import { facultyItems } from "./FacultyDashboard";
import api from "../services/api";

export default function FacultyProfile() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
    designation: user?.designation || "",
    institutionName: user?.institutionName || "",
    bio: user?.bio || "",
    contactNumber: user?.contactNumber || "",
    email: user?.email || "",
  });

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/profile/me");
        const profile = res.data.profile;
        if (profile) {
          setForm({
            name: user?.name || "",
            department: profile.department || user?.department || "",
            designation: profile.designation || user?.designation || "",
            institutionName:
              profile.institutionNameRaw ||
              profile.institution?.institutionName ||
              user?.institutionName ||
              "",
            bio: profile.bio || user?.bio || "",
            contactNumber: profile.contactNumber || user?.contactNumber || "",
            email: user?.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch faculty profile:", err);
        setError(err.response?.data?.message || "Failed to load faculty profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyProfile();
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        department: form.department,
        designation: form.designation,
        institutionNameRaw: form.institutionName,
        bio: form.bio,
        contactNumber: form.contactNumber,
      };

      await api.put("/profile/me", payload);

      loginUser({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update faculty profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        brand={form.name || "Faculty"}
        subtitle="Faculty"
        items={facultyItems}
        active="Profile"
      />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Faculty Profile</h2>
          <p className="text-muted text-sm mb-6">Update your academic credentials and details.</p>

          {error && (
            <p className="text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          {saved && (
            <p className="text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              Faculty profile updated successfully.
            </p>
          )}

          <form onSubmit={handleSave} className="card flex flex-col gap-4">
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center text-muted gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xs">Loading profile from server...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Full Name</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full disabled:bg-slate-50 disabled:text-muted"
                    placeholder="Full name"
                    value={form.name}
                    disabled
                  />
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Institution / College</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                    placeholder="e.g. National Institute of Technology"
                    value={form.institutionName}
                    onChange={update("institutionName")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted font-medium mb-1 block">Department</label>
                    <input
                      className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                      placeholder="e.g. Computer Science"
                      value={form.department}
                      onChange={update("department")}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted font-medium mb-1 block">Designation</label>
                    <input
                      className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                      placeholder="e.g. Associate Professor"
                      value={form.designation}
                      onChange={update("designation")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Contact Number</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                    placeholder="e.g. +91 9876543210"
                    value={form.contactNumber}
                    onChange={update("contactNumber")}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Bio / Research Focus</label>
                  <textarea
                    rows={3}
                    className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full resize-none"
                    placeholder="Brief description of research interests, teaching areas, or mentorship focus"
                    value={form.bio}
                    onChange={update("bio")}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Account Email</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full disabled:bg-slate-50 disabled:text-muted"
                    placeholder="Email"
                    value={form.email}
                    onChange={update("email")}
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary justify-center flex items-center gap-1.5 disabled:opacity-60 mt-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}