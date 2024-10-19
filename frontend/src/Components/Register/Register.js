import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      // Send a POST request to the backend for registration
      await axios.post(`${backendUrl}/register`, {
        name,
        email,
        password,
      });

      // On successful registration, navigate to the login page
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            error.response.data.error ||
            "Some error occurred"
        );
      } else {
        setError("Some error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
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
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC822] focus:border-[#FCC822]"
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
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC822] focus:border-[#FCC822]"
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
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC822] focus:border-[#FCC822]"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-[#FCC822] rounded-md hover:bg-[#FCC822] focus:outline-none focus:ring-2 focus:ring-[#FCC822]"
            >
              Register
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#FCC822] hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
