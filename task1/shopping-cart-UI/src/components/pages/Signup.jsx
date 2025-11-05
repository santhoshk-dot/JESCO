import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    otp: "",
    role: "user",        // 👈 default role
    adminSecret: "",     // 👈 only used if role = admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!formData.mobile) {
      alert("Please enter mobile number first!");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { mobile: formData.mobile });
      setOtpSent(true);
      setSuccess("OTP sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Signup + Auto Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Filter out adminSecret if role != admin
      const payload = { ...formData };
      if (payload.role !== "admin") delete payload.adminSecret;

      const res = await api.post("/auth/signup", payload);
      const { token, user } = res.data;

      if (token && user) {
        login(user, token);
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => navigate("/"), 800);
      } else {
        setError("Signup succeeded but token not received");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Admin Secret (only if admin) */}
          {formData.role === "admin" && (
            <input
              type="text"
              name="adminSecret"
              placeholder="Enter Admin Secret Key"
              value={formData.adminSecret}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
              required
            />
          )}

          {/* Mobile + OTP */}
          <div className="flex space-x-2">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="px-4 bg-black text-white rounded-lg hover:bg-gray-800 
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                items-center space-x-2 cursor-pointer font-medium text-xs"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
              required
            />
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                items-center space-x-2 cursor-pointer font-medium text-xs"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
