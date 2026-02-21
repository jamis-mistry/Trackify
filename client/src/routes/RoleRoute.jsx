import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const allowedRoles = Array.isArray(role) ? role.map(r => r.toLowerCase()) : [role.toLowerCase()];

  if (!allowedRoles.includes(user.role.toLowerCase())) {
    // Redirect based on actual role
    switch (user.role.toLowerCase()) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "organization":
        return <Navigate to="/organization/dashboard" />;
      case "worker":
        return <Navigate to="/worker/dashboard" />;
      default:
        return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};

export default RoleRoute;
