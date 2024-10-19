import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Loader from "../Loader/Loader";
const Result = () => {
  const [users, setUsers] = useState([]); // To hold the profile data
  const [loading, setLoading] = useState(true); // Loader state
  const navigate = useNavigate(); // For navigation
  const backendUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/getLeaderBoard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data); // Store the fetched profile data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        // setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Navigate to login if unauthorized
        } else {
          toast.error("Error occurred while fetching users list"); // Show toast error for any other errors
        }
      }
    };

    fetchUsers();
  }, [navigate, backendUrl]);

  // Render loader while fetching data
  if (loading) {
    return <Loader size={24} />;
  }

  // Destructure the data if available
  const { userId, name, score, leaderBoardrank } = users || [];
  users.sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden max-w-lg mx-auto mt-16">
      <div className="bg-[#FCC822] py-2 px-4">
        <h2 className="text-xl font-semibold text-gray-800">LeaderBoard</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {users?.map((user, index) => (
          <li key={index} className="flex items-center py-4 px-6">
            <span className="text-gray-700 text-lg font-medium mr-4">
              {index + 1}.
            </span>
            <img
              className="w-12 h-12 rounded-full object-cover mr-4"
              src="/images/profile.png"
              alt="User avatar"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
              <p className="text-gray-600 text-base">
                {index + 1 === 1 && <span>🔥🔥🔥</span>}
                {index + 1 === 2 && <span>🔥🔥</span>}
                {index + 1 === 3 && <span>🔥</span>}
                {user.score} points
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
