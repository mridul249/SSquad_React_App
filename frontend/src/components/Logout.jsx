// src/components/Logout.jsx

import React, { useEffect } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("/auth/logout");
        // Remove JWT token
        localStorage.removeItem("token");
        toast.success("Logged out successfully.");
      } catch (error) {
        toast.error("Error logging out. Please try again.");
      } finally {
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default Logout;
