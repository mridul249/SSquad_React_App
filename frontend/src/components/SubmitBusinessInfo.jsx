import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronLeft, FaSpinner } from "react-icons/fa";

function SubmitBusinessInfo() {
  const [brandName, setBrandName] = useState("");
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [outletType, setOutletType] = useState("Single outlet");
  const [numberOfOutlets, setNumberOfOutlets] = useState(1);
  const [addressOnMap, setAddressOnMap] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentSignupStep, setCurrentSignupStep] = useState(3);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/auth/user-info");
        if (res.data.success) {
          const { currentSignupStep } = res.data;
          if (currentSignupStep < 3) {
            toast.error("Please complete the previous steps first.");
            navigate("/verify-otp");
          }
        }

        const businessInfoRes = await axios.get("/business/info");
        if (businessInfoRes.data.success) {
          const info = businessInfoRes.data.businessInfo;
          setBrandName(info.brandName || "");
          setPrimaryCategory(info.primaryCategory || "");
          setOutletType(info.outletType || "Single outlet");
          setNumberOfOutlets(info.numberOfOutlets || 1);
          setAddressOnMap(info.businessAddress.addressOnMap || "");
          setFullAddress(info.businessAddress.fullAddress || "");
          setLandmark(info.businessAddress.landmark || "");
          setTermsAgreed(info.termsAgreed || false);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSubmitBusinessInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/business/add-info", {
        brandName,
        primaryCategory,
        outletType,
        numberOfOutlets:
          outletType === "Multiple outlets" ? Number(numberOfOutlets) : 1,
        businessAddress: {
          addressOnMap,
          fullAddress,
          landmark,
        },
        termsAgreed,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const { currentSignupStep } = res.data;
        if (currentSignupStep === 4) {
          navigate("/submit-final-details");
        } else {
          navigate("/login");
        }
      } else {
        toast.error(res.data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Submission failed"
      );
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

        {/* Form Section */}
        <form
          onSubmit={handleSubmitBusinessInfo}
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
            Business Information
          </h2>

          {/* Brand Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Brand Name"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>

          {/* Primary Category */}
          <div className="mb-4">
            <select
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={primaryCategory}
              onChange={(e) => setPrimaryCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose primary category
              </option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
            </select>
          </div>

          {/* Outlet Type */}
          <div className="mb-4">
            <select
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={outletType}
              onChange={(e) => setOutletType(e.target.value)}
              required
            >
              <option>Single outlet</option>
              <option>Multiple outlets</option>
            </select>
          </div>

          {/* Number of Outlets (Conditional) */}
          {outletType === "Multiple outlets" && (
            <div className="mb-4">
              <input
                type="number"
                placeholder="Number of outlets"
                className="w-full p-3 rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: "#333333",
                  color: "white",
                  borderColor: "#3d3d3d",
                }}
                value={numberOfOutlets}
                onChange={(e) => setNumberOfOutlets(e.target.value)}
                min="2"
                required
              />
            </div>
          )}

          {/* Address Inputs */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Choose address on map"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={addressOnMap}
              onChange={(e) => setAddressOnMap(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Full address"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Landmark (optional)"
              className="w-full p-3 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "#333333",
                color: "white",
                borderColor: "#3d3d3d",
              }}
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              required
            />
            <label className="ml-2 text-sm text-gray-400">
              I agree to{" "}
              <a href="#" className="text-green-500 hover:underline">
                terms and conditions
              </a>
            </label>
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
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitBusinessInfo;
