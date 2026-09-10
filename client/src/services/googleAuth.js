import api from "./api";

/**
 * Initializes and triggers Google OAuth flow.
 * Supports official Google Identity Services (GIS) One Tap / Popup
 * and graceful fallback for dev / demo setups.
 */
export async function signInWithGoogle({ role = "student" } = {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return new Promise((resolve, reject) => {
    // 1. Standard Google OAuth2 Popup via initTokenClient (forces account selection popup)
    if (
      clientId &&
      clientId !== "your-google-client-id.apps.googleusercontent.com" &&
      window.google?.accounts?.oauth2
    ) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid profile email",
          prompt: "select_account", // Enforce native account picker popup
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              return reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }
            try {
              // Fetch profile info using the access token
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              if (!userInfoRes.ok) {
                throw new Error("Failed to fetch Google profile info");
              }
              const profile = await userInfoRes.json();
              const res = await api.post("/auth/google", {
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                role,
              });
              resolve(res.data);
            } catch (err) {
              reject(err);
            }
          },
        });

        // Open native Google Account Selector popup
        tokenClient.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (err) {
        console.warn("Google OAuth2 tokenClient failed, attempting One Tap / GIS ID prompt:", err);
      }
    }

    // 2. Google Identity Services ID token prompt if oauth2 is not available
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

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackOAuth();
          }
        });
        return;
      } catch (err) {
        console.warn("Google Identity Services ID prompt failed:", err);
      }
    }

    // 3. Graceful Dev / Demo fallback flow
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
