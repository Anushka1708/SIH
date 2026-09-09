export function getCurrentUser() {
  const saved = localStorage.getItem("skillbridge_user");
  return saved ? JSON.parse(saved) : null;
}

export function loginUser(user) {
  // user = { name, email, role, companyName?, institutionName? }
  localStorage.setItem("skillbridge_user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("skillbridge_user");
}

export function getDashboardPath(role) {
  const map = {
    Student: "/student-dashboard",
    Faculty: "/faculty-dashboard",
    Institution: "/institution-dashboard",
    Company: "/company-dashboard",
  };
  return map[role] || "/login";
}