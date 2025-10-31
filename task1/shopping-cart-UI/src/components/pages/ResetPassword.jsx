import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // token from URL: /reset-password/:token

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: formData.password, // backend expects newPassword
        }),
      });

      if (!response.ok) {
        const err = await response.json();

        //  Show custom messages based on backend error
        if (response.status === 401) {
          throw new Error("Invalid or expired reset link. Please try again.");
        }

        if (response.status === 400) {
          throw new Error("Password reset failed. Please check your password.");
        }

        throw new Error(err.message || "Something went wrong. Try again.");
      }

      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
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

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-black"
                required
              />
            </div>

            {/* Error Message  */}
            {errorMsg && (
              <p className="text-red-600 text-sm text-center font-medium">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <p className="text-center text-green-600 font-medium">
            ✅ Password has been successfully reset.  
            <Link to="/login" className="text-black font-medium ml-1 underline">
              Login Now
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
