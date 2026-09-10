export function getCurrentUser() {
  const saved = localStorage.getItem("skillbridge_user");
  return saved ? JSON.parse(saved) : null;
}

export function logout() {
  localStorage.removeItem("skillbridge_user");
}