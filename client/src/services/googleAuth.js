import api from "./api";

/**
 * Initiates Google OAuth sign-in flow.
 * If VITE_GOOGLE_CLIENT_ID is valid and Google Identity Services SDK is loaded,
 * triggers Google prompt. Otherwise, falls back to a clean mock Google user dialog/login.
 */
export async function signInWithGoogle({ role = "student" } = {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return new Promise(async (resolve, reject) => {
    // If Google Identity script is present and clientId is configured
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
              const res = await api.post("/auth/google", {
                credential: response.credential,
                role,
              });
              resolve(res.data);
            } catch (err) {
              reject(err);
            }
          },
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackSignIn();
          }
        });
        return;
      } catch (e) {
        console.warn("Google GIS initialization error, falling back:", e);
      }
    }

    // Direct / Dev fallback: prompt for email or use Google demo profile
    await fallbackSignIn();

    async function fallbackSignIn() {
      try {
        const demoEmail = `google.user.${role}@demo.com`;
        const demoName = role === "company" ? "Google Partner Corp" : "Aarav Sharma (Google)";
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
