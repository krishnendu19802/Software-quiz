import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Loader from "../Loader/Loader";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null); // To hold the profile data
  const [loading, setLoading] = useState(true); // Loader state
  const navigate = useNavigate(); // For navigation
  const backendUrl = process.env.REACT_APP_URL;
  const [selectedSection, setSelectedSection] = useState("userInfo");

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
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        // setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Navigate to login if unauthorized
        } else {
          toast.error("Error occurred while fetching profile data"); // Show toast error for any other errors
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Render loader while fetching data
  if (loading) {
    return <Loader size={24} />;
  }

  // Destructure the data if available
  const { name, email, lastQuestions, lastQuizzes, score, rank } =
    profileData || {};

  return (
    <>
      {/* component */}
      <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
        <div>
          <div className="-mx-6 px-6 py-4">
            <Link to="/">
              <img src="/images/logo.png" className="w-32" alt="tailus logo" />
            </Link>
          </div>
          <div className="mt-8 text-center">
            <img
              src="/images/profile.png"
              alt="user"
              className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
            />
            <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
              {name}
            </h5>
          </div>
          <ul className="space-y-2 tracking-wide mt-8">
            <li>
              <a
                href="#"
                aria-label="dashboard"
                className={`px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group ${
                  selectedSection === "userInfo"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-white"
                    : ""
                }`}
                onClick={() => setSelectedSection("userInfo")}
              >
                <svg className="-ml-1 h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                    className="fill-current text-cyan-400 dark:fill-slate-600"
                  />
                  <path
                    d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                    className="fill-current text-cyan-200 group-hover:text-cyan-300"
                  />
                  <path
                    d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                    className="fill-current group-hover:text-sky-300"
                  />
                </svg>
                <span className="-mr-1 font-medium">User Info</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group ${
                  selectedSection === "lastQuestions"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-white"
                    : ""
                }`}
                onClick={() => setSelectedSection("lastQuestions")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    className="fill-current text-gray-300 group-hover:text-cyan-300"
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                    clipRule="evenodd"
                  />
                  <path
                    className="fill-current text-gray-600 group-hover:text-cyan-600"
                    d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                  />
                </svg>
                <span className="group-hover:text-gray-700">
                  Last questions Attempted
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group ${
                  selectedSection === "lastQuizzes"
                    ? "bg-gradient-to-r  from-yellow-500 to-yellow-300 text-white"
                    : ""
                }`}
                onClick={() => setSelectedSection("lastQuizzes")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    className="fill-current text-gray-600 group-hover:text-cyan-600"
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  />
                  <path
                    className="fill-current text-gray-300 group-hover:text-cyan-300"
                    d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"
                  />
                </svg>
                <span className="group-hover:text-gray-700">
                  Last quizzes Attempted
                </span>
              </a>
            </li>
            {/* You can add more list items here for other sections if needed */}
          </ul>
        </div>
      </aside>
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div className="sticky z-10 top-0 h-16 border-b bg-white lg:py-2.5">
          <div className="px-6 flex items-center justify-between space-x-4 2xl:container">
            <h5
              hidden=""
              className="text-2xl text-gray-600 font-medium lg:block"
            >
              Dashboard
            </h5>
            <button className="w-12 h-16 -mr-2 border-r lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 my-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className=" m-6 px-6 pt-6 2xl:container py-6 px-6 rounded-xl border border-gray-200 bg-white">
          {/* Conditional rendering based on the selected section */}
          {selectedSection === "userInfo" && (
            <>
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <p className="text-gray-700">
                Name: <span className="font-semibold">{name}</span>
              </p>
              <p className="text-gray-700">
                Email: <span className="font-semibold">{email}</span>
              </p>
              <p className="text-gray-700">
                Score: <span className="font-semibold">{score}</span>
              </p>
              <p className="text-gray-700">
                Rank: <span className="font-semibold">#{rank}</span>
              </p>
            </>
          )}

          {/* Last Questions Section */}
          {selectedSection === "lastQuestions" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Last Questions Attempted
              </h2>
              <ul className="divide-y divide-gray-200">
                {lastQuestions?.map((question, index) => (
                  <li key={index} className="py-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {question.topicName}
                      </span>{" "}
                      - Question ID: {question.questionId} | Status:{" "}
                      {question.status === 1 ? "Correct" : "Incorrect"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Attempted at:{" "}
                      {new Date(question.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Last Quizzes Section */}
          {selectedSection === "lastQuizzes" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Last Quizzes Attempted
              </h2>
              <ul className="divide-y divide-gray-200">
                {lastQuizzes?.map((quiz, index) => (
                  <li key={index} className="py-4">
                    <p className="text-gray-700">
                      Quiz ID: {quiz.quizId} | Score: {quiz.score}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Attempted at: {new Date(quiz.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
