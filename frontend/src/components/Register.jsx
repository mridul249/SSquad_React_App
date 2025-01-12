import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronLeft, FaSpinner } from "react-icons/fa";

function Register() {
  const [companyName, setCompanyName] = useState("");
  const [yourName, setYourName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", {
        companyName,
        yourName,
        position,
        email,
        phone,
      });

      toast.success(res.data.message);

      switch (res.data.currentSignupStep) {
        case 2:
          navigate("/verify-otp");
          break;
        case 3:
          navigate("/submit-business-info");
          break;
        case 4:
          navigate("/submit-final-details");
          break;
        default:
          navigate("/login");
          break;
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed");
      }
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
          width: "60vw", // Adjusted width of the outer container
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

        {/* Register Form Section */}
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md relative"
          style={{
            flex: "1",
            padding: "1.5rem",
            backgroundColor: "#171717", // Updated background color
            color: "white",
            borderRadius: "12px",
          }}
        >
          {/* Top Bar: Back Icon and Progress Tracker */}
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white hover:text-gray-300"
            >
              <FaChevronLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#29bc2f" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#444" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#444" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#444" }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Please enter your details to register for an account.
          </p>

          {/* Company Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          {/* Your Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              required
            />
          </div>

          {/* Position */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Position"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
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
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
