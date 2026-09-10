// Theme management utility for Light, Dark, and System modes

const THEME_KEY = "skillbridge_theme";

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || "system";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem(THEME_KEY, theme);
  // Dispatch custom event so listeners update immediately
  window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme, isDark } }));
}

export function isCurrentlyDark() {
  return document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
  const current = getStoredTheme();
  let next = "light";
  if (current === "light") next = "dark";
  else if (current === "dark") next = "light";
  else {
    // If system, toggle opposite to current system state
    next = isCurrentlyDark() ? "light" : "dark";
  }
  applyTheme(next);
  return next;
}
