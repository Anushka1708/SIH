import api from "./api";

/**
 * Initializes and triggers Google OAuth flow.
 * Supports official Google Identity Services (GIS) One Tap / Popup
 * and graceful fallback for dev / demo setups.
 */
export async function signInWithGoogle({ role = "student" } = {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return new Promise((resolve, reject) => {
    // Check if real Google Client ID is configured and Google SDK script is ready
    if (
      clientId &&
      clientId !== "your-google-client-id.apps.googleusercontent.com" &&
      window.google?.accounts?.id
    ) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              if (!response?.credential) {
                throw new Error("No credential received from Google.");
              }
              const res = await api.post("/auth/google", {
                credential: response.credential,
                role,
              });
              resolve(res.data);
            } catch (err) {
              reject(err);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Trigger Google One-Tap / Account Chooser
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackOAuth();
          }
        });
        return;
      } catch (err) {
        console.warn("Google Identity Services initialization failed, falling back:", err);
      }
    }

    // Direct / Dev fallback flow
    fallbackOAuth();

    async function fallbackOAuth() {
      try {
        const demoEmail = `google.user.${role}@demo.com`;
        const demoName =
          role === "company"
            ? "Google Enterprise Partner"
            : role === "faculty"
            ? "Dr. Google Scholar"
            : role === "institution"
            ? "Google Partner University"
            : "Aarav Sharma (Google User)";

        const res = await api.post("/auth/google", {
          email: demoEmail,
          name: demoName,
          role,
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    }
  });
}
