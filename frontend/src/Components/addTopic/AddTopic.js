import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTopic = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [showInput, setShowInput] = useState(false); // Toggle input form visibility
  const [fetchError, setFetchError] = useState(""); // Error when fetching topics
  const [submitError, setSubmitError] = useState(""); // Error when submitting new topic
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getTopics`);
        setTopics(response.data);
        setFetchError(""); // Clear any previous fetch errors
      } catch (error) {
        setFetchError("Failed to load topics.");
      }
    };

    fetchTopics();
  }, [backendUrl]);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    setSubmitError(""); // Reset error state for submission

    if (!newTopic) {
      setSubmitError("Topic name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.post(
        `${backendUrl}/addTopic`,
        { topicName: newTopic },
        { headers: { Authorization: `Bearer ${token}` } } // Attach token in header
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Topic added successfully!");

        // Update topics list and clear input
        setTopics((prevTopics) => [
          ...prevTopics,
          {
            topicId: response.data.topicId,
            topicName: newTopic,
            questionCount: 0,
          },
        ]);
        setNewTopic("");
        setShowInput(false); // Hide input form after successful submission
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          if (
            error.response.data.message === "Token expired. Please login again."
          ) {
            toast.error(error.response.data.message);
          }
          navigate("/login");
        } else if (error.response.data.message || error.response.data.error) {
          setSubmitError(
            error.response.data.message ||
              error.response.data.error ||
              "Failed to add topic."
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
      <h2 className="text-3xl font-bold mb-6">Add a New Topic</h2>
      {/* Add new topic button */}
      {!showInput && (
        <button
          onClick={() => setShowInput(true)} // Show input on click
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded  mb-3 "
        >
          Add New Topic
        </button>
      )}

      {/* Show input form only when showInput is true */}
      {showInput && (
        <form
          onSubmit={handleAddTopic}
          className="w-full sm:w-64 lg:w-72 rounded-lg overflow-hidden shadow-lg bg-white mx-auto mt-4 mb-3"
        >
          <div className="px-4 py-2 mb-1">
            <div className="font-bold text-xl mb-1">
              <label
                htmlFor="newTopic"
                className="block text-sm font-medium text-gray-700"
              >
                New Topic Name
              </label>
              <input
                id="newTopic"
                name="newTopic"
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="px-4 py-2">
            <button
              type="submit"
              className="bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
            >
              Add Topic
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)} // Hide input form on cancel
              className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>

          {submitError && (
            <p className="text-red-500 mb-4 px-4">{submitError}</p>
          )}
        </form>
      )}
      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
        {topics.map((topic) => (
          <div
            key={topic.topicId}
            className="w-full sm:w-64 lg:w-72 rounded-lg overflow-hidden shadow-lg bg-white mx-auto"
          >
            <img
              className="w-full h-64 object-cover mt-2 rounded"
              src="images/q.png"
              alt=""
            />
            <div className="px-4 py-2">
              <div className="font-bold text-xl mb-1">
                {topic.topicName} Quiz
              </div>
              <p className="text-gray-700 text-sm">
                {topic.questionCount} Questions
              </p>
            </div>
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  navigate(`/quiz/${topic.topicId}`);
                }}
                className="bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
              >
                Play Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddTopic;
