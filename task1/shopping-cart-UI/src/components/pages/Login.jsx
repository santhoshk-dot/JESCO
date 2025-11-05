import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      const { token, user } = res.data;

      if (!user) {
        throw new Error("User data missing in response");
      }

      // 🧠 Store login details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || "user");

      // Update Auth Context
      login(user, token);

      setSuccessMsg("✅ Login successful! Redirecting...");

      // 🧭 Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setErrorMsg("Invalid email or password!");
      } else {
        setErrorMsg(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
            required
          />

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

          {errorMsg && (
            <p className="text-red-600 text-sm text-center font-medium">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-green-600 text-sm text-center font-medium">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/forgot-password" className="text-black font-medium">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600 mt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-black font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
