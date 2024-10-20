import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const backendUrl = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data); // Store the fetched profile data
      } catch (error) {
        // setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate("/"); // Navigate to login if unauthorized
        } else {
          toast.error("Error occurred while fetching profile data"); // Show toast error for any other errors
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const { admin } = profileData || {};

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // Show success message for logout
    alert("Logged out successfully");

    // Optionally, navigate to the homepage after logout
    navigate("/");
  };

  return (
    <header className="h-16 flex items-center shadow-sm">
      <nav className="flex justify-between items-center w-9/12 mx-auto">
        <a href="/" className="text-zinc-800 font-bold uppercase">
          <img src="/images/logo.png" alt="logo" />
        </a>
        <div className="space-x-5 flex items-center">
          <ul className="space-x-5 sm:flex hidden">
            <li className="hover:text-yellow-500">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="hover:text-yellow-500">
              <Link to="/leaderboard">LeaderBoard</Link>
            </li>
            <li className="hover:text-yellow-500">
              <Link to="/getTopics">Topics</Link>
            </li>
            {admin === 1 ? (
              <>
                <li className="hover:text-yellow-500">
                  <Link to="/addTopic">Add Topic</Link>
                </li>
                <li className="hover:text-yellow-500">
                  <Link to="/addQuestion">Add Questions</Link>
                </li>
                <li className="hover:text-yellow-500">
                  <Link to="/addAdmin">Add Admin</Link>
                </li>
              </>
            ) : null}
          </ul>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="font-medium px-5 py-1 border border-[#FCC822] rounded text-[#FCC822]"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="font-medium px-5 py-1 border border-[#FCC822] rounded text-[#FCC822]">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
