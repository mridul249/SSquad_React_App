import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyOTP from "./components/VerifyOTP";
import SubmitBusinessInfo from "./components/SubmitBusinessInfo";
import SubmitFinalDetails from "./components/SubmitFinalDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* Toast Container to display toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Auto close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Optional: Set dark theme
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/verify-otp" element={<ProtectedRoute requiredStep={2} />}>
          <Route index element={<VerifyOTP />} />
        </Route>

        <Route path="/submit-business-info" element={<ProtectedRoute requiredStep={3} />}>
          <Route index element={<SubmitBusinessInfo />} />
        </Route>

        <Route path="/submit-final-details" element={<ProtectedRoute requiredStep={4} />}>
          <Route index element={<SubmitFinalDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
