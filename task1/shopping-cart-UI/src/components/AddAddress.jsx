import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'
const AddAddress = () => {
  const [form, setForm] = useState({
    label: 'Home',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    default: false
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
   try {
      const res = await api.post("/addresses", form);
      alert('Address added successfully!');
      navigate('/checkout');
    } catch (err) {
      console.error(err);
      alert('Failed to add address.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Address</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Label */}
        <div>
          <label htmlFor="label" className="block mb-1 font-medium">Address Label</label>
          <select
            id="label"
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block mb-1 font-medium">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block mb-1 font-medium">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block mb-1 font-medium">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter state"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Zip Code */}
        <div>
          <label htmlFor="zip" className="block mb-1 font-medium">Zip Code</label>
          <input
            id="zip"
            type="text"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="Enter zip code"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block mb-1 font-medium">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Enter country"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Set as default */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="default"
            checked={form.default}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label>Set as default address</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
