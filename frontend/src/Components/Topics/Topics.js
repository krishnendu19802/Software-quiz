import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const backendUrl = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getTopics`);
        setTopics(response.data);
        if (error) setError("");
      } catch (error) {
        setError("Failed to load topics.");
      }
    };

    fetchTopics();
  }, [backendUrl]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Topics</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* <div className="grid gap-4 w-full max-w-xl">
        {topics.map((topic) => (
          // <div
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mx-auto">
            <img
              className="w-full h-48 object-cover"
              src="images/banner.png"
              alt=""
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{topic.topicName}</div>
              <p className="text-gray-700 text-base">
                Questions: {topic.questionCount}
              </p>
            </div>
            <div className="px-6 py-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Play Quiz
              </button>
            </div>
          </div>
        ))}
      </div> */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
        {topics.map((topic) => (
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mx-auto">
            <img
              className="w-full h-48 object-cover"
              src="images/banner.png"
              alt=""
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{topic.topicName}</div>
              <p className="text-gray-700 text-base">
                Questions: {topic.questionCount}
              </p>
            </div>
            <div className="px-6 py-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Play Quiz
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
        {topics.map((topic) => (
          <div
            key={topic.topicId}
            className="w-full sm:w-64 lg:w-72 rounded-lg overflow-hidden shadow-lg bg-white mx-auto"
          >
            <img
              className="w-full h-64 object-cover mt-2 rounded" // Decreased the height of the image
              src="images/q.png"
              alt=""
            />
            <div className="px-4 py-2">
              {" "}
              <div className="font-bold text-xl mb-1">
                {topic.topicName} Quiz
              </div>
              <p className="text-gray-700 text-sm">
                {" "}
                {topic.questionCount} Questions
              </p>
            </div>
            <div className="px-4 py-2">
              <button
                className="bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  navigate(`/quiz/${topic.topicId}`);
                }}
              >
                Play Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
