import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
            <li className="hover:text-yellow-500">
              <Link to="/profile">Profile</Link>
            </li>
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
