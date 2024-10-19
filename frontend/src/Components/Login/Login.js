import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;
  //   console.log(backendUrl)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        // Save token in local storage and navigate to homepage
        localStorage.setItem("token", response.data.token);
        navigate("/getTopics");
      }
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // If error code is 400, show specific error message or a fallback error
        if (error.response.data.message || error.response.data.error) {
          setError(
            error.response.data.message ||
              error.response.data.error ||
              "Invalid email or password."
          );
        } else {
          setError("Some error occurred");
        }
      } else {
        setError("Some error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
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
              Login
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#FCC822] hover:underline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
