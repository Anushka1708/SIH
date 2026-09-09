import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // logged in, but wrong role trying to access another dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
}