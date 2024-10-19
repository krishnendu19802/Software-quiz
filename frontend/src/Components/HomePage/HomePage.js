// Home.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Loading from "./Loading";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingLeaderBoard, setLoadingLeaderBoard] = useState(false);

  const handleStartQuiz = () => {
    setLoading(true);

    // Check if user is logged in by checking for a token in localStorage
    const token = localStorage.getItem("token");

    setTimeout(() => {
      if (token) {
        // If token exists, navigate to the topics page
        navigate("/getTopics");
      } else {
        // If not logged in, navigate to the login page
        navigate("/login");
      }
      setLoading(false);
    }, 3000);
  };

  const handleLeaderBoard = () => {
    setLoadingLeaderBoard(true);

    // Check if user is logged in by checking for a token in localStorage
    const token = localStorage.getItem("token");

    setTimeout(() => {
      if (token) {
        // If token exists, navigate to the topics page
        navigate("/leaderboard");
      } else {
        // If not logged in, navigate to the login page
        navigate("/login");
      }
      setLoadingLeaderBoard(false);
    }, 3000);
  };

  return (
    <section
      className="lg:w-9/12 md:w-[90%] w-[95%] mx-auto mt-12 flex flex-col md:flex-row-reverse justify-between items-center"
      id="rulesContainer"
    >
      {/* {loading && <Loading />} */}

      <div className="md:w-1/2 w-full">
        <img src="/images/banner.png" alt="banner" className="w-full mx-auto" />
      </div>

      <div className="md:w-1/2 w-full">
        <h1 className="my-8 lg:text-4xl text-3xl md:w-4/6 font-medium text-[#333] lg:leading-normal leading-normal mb-3">
          Learn new concepts for each question
        </h1>
        <p className="border-l-4 pl-2 py-2 mb-6 text-gray-500">
          Have Fun playing quizzes and compete with your friends.{" "}
        </p>
        <div className="flex items-center">
          <button
            onClick={handleStartQuiz}
            className={`bg-[#FCC822] px-6 py-2 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            id="startQuiz"
            type="button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Quiz"}
          </button>

          <button
            className="px-6 py-2 text-[#FCC822] hover:bg-[#FCC822] hover:text-white rounded inline-flex ml-3 transition-all duration-300"
            type="button"
            onClick={handleLeaderBoard}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
            {loadingLeaderBoard ? "Loading..." : "LeaderBoard"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
