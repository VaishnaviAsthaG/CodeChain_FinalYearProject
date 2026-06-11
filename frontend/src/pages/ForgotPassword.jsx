import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/forgot-password", {
        email: form.email,
      });

      setMessage(data.message);
      setMessageType("success");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
      setMessageType("error");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/reset-password", form);

      setMessage(data.message);
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed");
      setMessageType("error");
    }
  };

  return (
    <div className="login-page">
      <nav className="top-nav">
        <div className="brand">✦ CodeChain</div>
      </nav>

      <div className="login-card">
        <div className="login-icon">🔐</div>

        <h1>Reset Password</h1>
        <p>Recover your CodeChain account using email OTP.</p>

        {message && (
          <div className={`auth-message ${messageType}`}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signin-btn">
              Send OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label>OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6 digit OTP"
              value={form.otp}
              onChange={handleChange}
              required
            />

            <label>NEW PASSWORD</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signin-btn">
              Reset Password →
            </button>
          </form>
        )}

        <p className="switch-text">
          Remember password?{" "}
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;