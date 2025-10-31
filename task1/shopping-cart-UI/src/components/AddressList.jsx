import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://jesco.onrender.com/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Select an address for checkout
  const handleSelect = (addr) => {
    localStorage.setItem("selectedAddress", JSON.stringify(addr));
    alert("Address selected for delivery!");
    navigate("/checkout");
  };

  // Delete an address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`http://jesco.onrender.com/addresses/${id}`);
      setAddresses(prev => prev.filter(addr => addr._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">My Addresses</h2>

      {addresses.length === 0 && (
        <p className="mb-4 text-gray-500">No addresses found. Please add one.</p>
      )}

      <ul className="space-y-2 mb-4">
        {addresses.map(addr => (
          <li
            key={addr._id}
            className="p-3 bg-white mb-3 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <p>{addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
              <p className="text-sm text-gray-500">{addr.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelect(addr)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 hover:shadow-lg transition duration-200"
              >
                Select
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 hover:shadow-lg transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-start">
        <Link to="/address/add">
          <button className="bg-black text-white px-3 py-2 rounded-lg font-semibold hover:shadow-lg transition duration-200">
            Add New Address
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddressList;
