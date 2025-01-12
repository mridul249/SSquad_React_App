// src/components/Dashboard.jsx

import React, { useEffect } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/user-info");
        if (!res.data.success) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
        toast.error("Please login to access the dashboard.");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <h1 className="text-white text-4xl">Welcome to your Dashboard</h1>
    </div>
  );
}

export default Dashboard;
