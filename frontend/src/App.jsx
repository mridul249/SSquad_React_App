// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyOTP from "./components/VerifyOTP";
import SubmitBusinessInfo from "./components/SubmitBusinessInfo";
import SubmitFinalDetails from "./components/SubmitFinalDetails";
import Dashboard from "./components/Dashboard";
import Customer from "./components/Customer"; // Assuming a Customer component exists
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout"; // Assuming a Logout component exists
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/submit-business-info" element={<SubmitBusinessInfo />} />
        <Route path="/submit-final-details" element={<SubmitFinalDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/customer" element={<Customer />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Fallback Route */}
      </Routes>
    </Router>
  );
}

export default App;
