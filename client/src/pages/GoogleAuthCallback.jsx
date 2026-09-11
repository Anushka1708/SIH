import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { loginUser } from "../utils/auth";
import api from "../services/api";

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse access_token from URL fragment: #access_token=...&token_type=Bearer...
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const hashParams = new URLSearchParams(hash || search);

        const accessToken = hashParams.get("access_token");
        const storedRole =
          sessionStorage.getItem("skillbridge_oauth_role") ||
          hashParams.get("state") ||
          "student";

        if (!accessToken) {
          // If user cancelled or error occurred in OAuth redirect
          const errorDesc = hashParams.get("error_description") || hashParams.get("error");
          throw new Error(errorDesc || "No Google authorization token received.");
        }

        // Fetch user profile from Google UserInfo API using the access token
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoRes.ok) {
          throw new Error("Failed to retrieve Google profile information.");
        }

        const profile = await userInfoRes.json();

        // Send to backend /api/auth/google
        const res = await api.post("/auth/google", {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          role: storedRole,
        });

        const { token, user } = res.data;
        if (token) {
          localStorage.setItem("skillbridge_token", token);
        }

        loginUser(user);

        // Redirect smoothly by user role
        const targetPath =
          user.role === "company"
            ? "/company"
            : user.role === "faculty"
            ? "/faculty"
            : user.role === "institution"
            ? "/institution"
            : "/student";

        navigate(targetPath, { replace: true });
      } catch (err) {
        console.error("Google OAuth Callback Error:", err);
        setError(err.message || "Failed to complete Google authentication.");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3500);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0B081E] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-indigo-500/30 flex items-center justify-center mb-5 shadow-2xl">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-base shadow-md">
          S
        </div>
      </div>

      {error ? (
        <div className="max-w-md bg-rose-950/40 border border-rose-800 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-rose-400" />
          <p className="text-sm font-bold text-rose-200">Google Authentication Failed</p>
          <p className="text-xs text-rose-300/80">{error}</p>
          <p className="text-[11px] text-muted">Redirecting back to login...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Loader2 size={36} className="animate-spin text-primary mx-auto" />
          <h2 className="text-lg font-bold text-white">Completing Google Sign-in...</h2>
          <p className="text-xs text-indigo-200/80 max-w-sm">
            Verifying your Google identity and loading your verified Antara workspace.
          </p>
        </div>
      )}
    </div>
  );
}
