import React, { useState } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaChevronLeft, FaSpinner } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black px-4"
      style={{ padding: "2rem 0" }}
    >
      {/* Outer Container */}
      <div
        className="flex flex-col lg:flex-row items-center justify-between w-full"
        style={{
          width: "60vw", // Adjusted width
        }}
      >
        {/* Title Section */}
        <div
          className="mb-8 lg:mb-0 lg:mr-16 text-center lg:text-left"
          style={{ flex: "1" }}
        >
          <h1
            className="text-white font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 6rem)", // Dynamic font size
            }}
          >
            outgoingg
          </h1>
        </div>

        {/* Login Form Section */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md relative"
          style={{
            flex: "1",
            padding: "1.5rem",
            backgroundColor: "#171717", // Form background color
            color: "white",
            borderRadius: "12px",
          }}
        >
          {/* Top Bar: Back Icon */}
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-white hover:text-gray-300"
            >
              <FaChevronLeft size={18} />
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          {/* Username Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username or Phone Number"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <Link
            to="/forgot-password"
            className="block mb-4 text-sm text-right"
            style={{ color: "#29bc2f" }}
          >
            Forgot Password?
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-lg transition"
            style={{
              backgroundColor: loading ? "#3d3d3d" : "#29bc2f",
              color: loading ? "white" : "black",
            }}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full mt-4 py-3 font-semibold rounded-lg border transition"
            style={{
              borderColor: "#29bc2f",
              color: "#29bc2f",
              backgroundColor: "transparent",
            }}
          >
            Create account
          </button>

          {/* Customer Link */}
          <div className="mt-6 text-center">
            <Link
              to="/customer"
              className="text-sm hover:underline"
              style={{ color: "#29bc2f" }}
            >
              Are you a Customer?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
