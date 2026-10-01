
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role ? `/${role}/home` : "/signin"} replace />;
  }

  return <Outlet />;
}
