import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, loginUser } from "../utils/auth";
import { companyItems } from "./CompanyDashboard";
import api from "../services/api";

export default function CompanyProfile() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: user?.companyName || "",
    industry: user?.industry || "",
    website: user?.website || "",
    location: user?.location || "",
    about: user?.about || "",
    companySize: user?.companySize || "",
    contactNumber: user?.contactNumber || "",
    email: user?.email || "",
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/profile/me");
        const profile = res.data.profile;
        if (profile) {
          setForm({
            companyName: profile.companyName || user?.companyName || "",
            industry: profile.industry || user?.industry || "",
            website: profile.website || user?.website || "",
            location: profile.location || user?.location || "",
            about: profile.about || user?.about || "",
            companySize: profile.companySize || user?.companySize || "",
            contactNumber: profile.contactNumber || user?.contactNumber || "",
            email: user?.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch company profile:", err);
        setError(err.response?.data?.message || "Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        companyName: form.companyName,
        industry: form.industry,
        website: form.website,
        location: form.location,
        about: form.about,
        companySize: form.companySize,
        contactNumber: form.contactNumber,
      };

      await api.put("/profile/me", payload);

      loginUser({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update company profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        brand={form.companyName || "Company"}
        subtitle="Company"
        items={companyItems}
        active="Profile"
      />
      <div className="flex-1">
        <Topbar placeholder="Search..." />
        <div className="p-6 max-w-xl">
          <h2 className="text-xl font-extrabold mb-1">Company Profile</h2>
          <p className="text-muted text-sm mb-6">Keep your company information up to date.</p>

          {error && (
            <p className="text-sm text-red bg-redSoft rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          {saved && (
            <p className="text-sm text-green bg-greenSoft rounded-lg px-3 py-2 mb-4">
              Company profile updated successfully.
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
                  <label className="text-xs text-muted font-medium mb-1 block">Company Name</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                    placeholder="Company name"
                    value={form.companyName}
                    onChange={update("companyName")}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Industry</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                    placeholder="e.g. IT Services, FinTech, Healthcare"
                    value={form.industry}
                    onChange={update("industry")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted font-medium mb-1 block">Location</label>
                    <input
                      className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                      placeholder="e.g. Bangalore, India"
                      value={form.location}
                      onChange={update("location")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted font-medium mb-1 block">Company Size</label>
                    <input
                      className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                      placeholder="e.g. 50-200"
                      value={form.companySize}
                      onChange={update("companySize")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Website</label>
                  <input
                    className="border border-line rounded-xl px-3 py-3 text-sm outline-none w-full"
                    placeholder="https://example.com"
                    value={form.website}
                    onChange={update("website")}
                  />
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
                  <label className="text-xs text-muted font-medium mb-1 block">About</label>
                  <textarea
                    rows={3}
                    className="border border-line rounded-xl px-3 py-2.5 text-sm outline-none w-full resize-none"
                    placeholder="Brief description about the company"
                    value={form.about}
                    onChange={update("about")}
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