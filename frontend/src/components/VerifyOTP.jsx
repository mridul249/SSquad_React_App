import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronLeft, FaSpinner } from "react-icons/fa";

function VerifyOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  // Handle OTP input changes
  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otpCode = otp.join("");
      const res = await axios.post("/auth/verify-otp", { otp: otpCode });

      if (res.data.success) {
        toast.success(res.data.message);

        switch (res.data.currentSignupStep) {
          case 3:
            navigate("/submit-business-info");
            break;
          case 4:
            navigate("/submit-final-details");
            break;
          case 5:
            navigate("/dashboard");
            break;
          default:
            navigate("/login");
            break;
        }
      } else {
        toast.error(res.data.message || "OTP Verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post("/auth/resend-otp");
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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

        {/* Verify OTP Form Section */}
        <form
          onSubmit={handleVerifyOTP}
          className="w-full max-w-md relative"
          style={{
            flex: "1",
            padding: "1.5rem",
            backgroundColor: "#171717", // Background for form
            color: "white",
            borderRadius: "12px",
          }}
        >
          {/* Top Bar: Back Icon and Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white hover:text-gray-300"
            >
              <FaChevronLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
              {/* Progress Indicator with 4 Dots */}
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#29bc2f" }} // Third dot (filled)
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#29bc2f" }} // Fourth dot (filled)
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#444" }} // First dot (unfilled)
              ></div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#444" }} // Second dot (unfilled)
              ></div>               
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            We sent a verification code to{" "}
            <span className="font-semibold">{email || "your email"}</span>.
            Enter the 6-digit code below to verify your account.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-lg rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: "#333333",
                  borderColor: "#3d3d3d",
                  color: "white",
                }}
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                required
              />
            ))}
          </div>

          {/* Verify OTP Button */}
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
              "Verify OTP"
            )}
          </button>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-400">
              Didn't receive the code?{" "}
            </span>
            <button
              type="button"
              onClick={handleResendEmail}
              className={`text-sm font-semibold hover:underline ${
                resendLoading ? "text-gray-400" : "text-green-500"
              }`}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
