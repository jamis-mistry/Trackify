import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role.toLowerCase() !== role.toLowerCase()) {
    // Redirect based on actual role
    switch (user.role.toLowerCase()) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "organization":
        return <Navigate to="/organization/dashboard" />;
      default:
        return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};

export default RoleRoute;
