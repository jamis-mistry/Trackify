import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Ensure user.role exists before checking
  const userRole = user.role ? user.role.toLowerCase() : "user";
  const allowedRoles = Array.isArray(role) ? role.map(r => r.toLowerCase()) : [role.toLowerCase()];

  if (!allowedRoles.includes(userRole)) {
    // Redirect based on actual role
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "organization":
        return <Navigate to="/organization/dashboard" />;
      case "worker":
        return <Navigate to="/worker/dashboard" />;
      default:
        // Prevent infinite redirects if role is user and trying to access user dashboard
        if (allowedRoles.includes("user")) return <Navigate to="/login" />; // Should not happen if logic is correct
        return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};

export default RoleRoute;
