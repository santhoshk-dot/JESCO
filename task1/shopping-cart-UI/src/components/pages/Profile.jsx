import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm">Full Name</label>
            <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Email</label>
            <p className="text-lg font-semibold">{user?.email || "N/A"}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Mobile</label>
            <p className="text-lg font-semibold">{user?.mobile || "N/A"}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Role</label>
            <p className="text-lg font-semibold capitalize">
              {user?.role || "User"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
