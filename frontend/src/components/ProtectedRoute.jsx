// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optionally, verify token validity here (e.g., expiration)

  return children;
}

export default ProtectedRoute;
