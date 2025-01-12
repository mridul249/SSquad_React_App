import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronLeft, FaSpinner } from "react-icons/fa";

function SubmitFinalDetails() {
  const [ownerName, setOwnerName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [hasGSTIN, setHasGSTIN] = useState(true);
  const [ifscCode, setIfscCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [fssaiCertificateNumber, setFssaiCertificateNumber] = useState("");
  const [isFssaiAvailable, setIsFssaiAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentSignupStep, setCurrentSignupStep] = useState(4);
  const navigate = useNavigate();

  const handleSubmitFinalDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/business/submit-documents", {
        ownerName: ownerName.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        gstNumber: hasGSTIN ? gstNumber.trim().toUpperCase() : "",
        hasGSTIN,
        bankDetails: {
          ifscCode: ifscCode.trim().toUpperCase(),
          accountNumber: accountNumber.trim(),
        },
        fssaiCertificateNumber: isFssaiAvailable
          ? fssaiCertificateNumber.trim()
          : "",
        isFssaiAvailable,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const { currentSignupStep } = res.data;
        if (currentSignupStep === 5) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } else {
        toast.error(res.data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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

        {/* Final Details Form Section */}
        <form
          onSubmit={handleSubmitFinalDetails}
          className="w-full max-w-md relative"
          style={{
            flex: "1",
            padding: "1.5rem",
            backgroundColor: "#171717", // Background for the form
            color: "white",
            borderRadius: "12px",
          }}
        >
          {/* Top Bar: Back Icon and Progress Tracker */}
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="text-white hover:text-gray-300"
            >
              <FaChevronLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: currentSignupStep >= step ? "#29bc2f" : "#444",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Final Details
          </h2>

          {/* Owner's Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Owner's Name"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
            <small className="block mt-1 text-sm text-gray-400">
              Enter the owner's legal name as per GST/PAN
            </small>
          </div>

          {/* PAN Number */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="PAN Number"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              required
              maxLength="10"
            />
            <small className="block mt-1 text-sm text-gray-400">
              PAN Number must be 10 characters
            </small>
          </div>

          {/* GST Number */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="GST Number"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              required={hasGSTIN}
              disabled={!hasGSTIN}
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={!hasGSTIN}
                onChange={(e) => setHasGSTIN(!e.target.checked)}
              />
              <label className="ml-2 text-sm text-gray-400">
                I don't have a GSTIN number
              </label>
            </div>
          </div>

          {/* Bank Details */}
          <h3 className="text-lg font-medium mb-4">Bank Details</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Bank IFSC Code"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Bank Account Number"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          {/* FSSAI Certificate */}
          <h3 className="text-lg font-medium mb-4">FSSAI Certificate</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="FSSAI Certificate Number"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={fssaiCertificateNumber}
              onChange={(e) => setFssaiCertificateNumber(e.target.value)}
              required={isFssaiAvailable}
              disabled={!isFssaiAvailable}
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={!isFssaiAvailable}
                onChange={(e) => setIsFssaiAvailable(!e.target.checked)}
              />
              <label className="ml-2 text-sm text-gray-400">
                FSSAI certificate unavailable/expired
              </label>
            </div>
          </div>

          {/* Submit Button */}
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
              "Submit for Verification"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitFinalDetails;
