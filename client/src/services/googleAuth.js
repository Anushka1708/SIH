/**
 * Initiates the standard Google OAuth 2.0 full-page redirect flow.
 * Redirects the entire browser page to Google's official Account Chooser screen:
 * https://accounts.google.com/o/oauth2/v2/auth
 */
export function signInWithGoogle({ role = "student" } = {}) {
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "245045366323-g8eh87rl3etbqollhodjvjfp7ofk7km5.apps.googleusercontent.com";

  // Store requested role so callback page can pass it to backend
  sessionStorage.setItem("skillbridge_oauth_role", role);

  const redirectUri = `${window.location.origin}/auth/google/callback`;

  // Build standard Google OAuth2 Authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "openid email profile",
    prompt: "select_account", // Enforce native Google Account Picker chooser screen
    include_granted_scopes: "true",
    state: role,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Perform full-page browser redirect to official Google Account Chooser
  window.location.href = googleAuthUrl;
}

