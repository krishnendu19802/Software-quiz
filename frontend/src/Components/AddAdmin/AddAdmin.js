import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitError(""); // Reset error state

    if (!name || !email || !password) {
      setSubmitError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      await axios.post(
        `${backendUrl}/addAdmin`,
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } } // Attach token in header
      );

      // Show success toast message
      toast.success("Admin added successfully!");

      // Clear input fields
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        if (error.response.data.message || error.response.data.error) {
          setSubmitError(
            error.response.data.message ||
              error.response.data.error ||
              "Failed to add admin."
          );
        } else {
          setSubmitError("Some error occurred.");
        }
      } else {
        setSubmitError("Some error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Add Admin</h2>
      {/* Submission error message */}
      {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
      {/* Add admin form */}
      <form
        onSubmit={handleAddAdmin}
        className="w-full max-w-xl p-4 bg-white shadow-md rounded-lg space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Add admin button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-yellow-300 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Add Admin
          </button>
        </div>
      </form>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default AddAdmin;
