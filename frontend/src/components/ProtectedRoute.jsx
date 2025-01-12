// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

function ProtectedRoute({ requiredStep }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSessionAndData = async () => {
      try {
        // Validate session and get user info
        const res = await axios.get("/auth/user-info");
        if (res.data.success) {
          const { currentSignupStep } = res.data;

          // Redirect if the user tries to access a page they are not eligible for
          if (currentSignupStep < requiredStep) {
            toast.error("Please complete the previous steps first.");
            const redirectRoute = currentSignupStep === 2 ? "/verify-otp" : "/register";
            navigate(redirectRoute);
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          toast.error("Unauthorized access. Please login again.");
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle session expiration
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Failed to validate session.");
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSessionAndData();
  }, [navigate, requiredStep]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
