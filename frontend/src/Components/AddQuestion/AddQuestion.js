import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddQuestion = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [statement, setStatement] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [ansIndex, setAnsIndex] = useState("0"); // Default to the first option
  const [fetchError, setFetchError] = useState(""); // Error when fetching topics
  const [submitError, setSubmitError] = useState(""); // Error when submitting new question
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    // Fetch existing topics
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

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setSubmitError(""); // Reset error state for submission

    if (
      !selectedTopic ||
      !statement ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4
    ) {
      setSubmitError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.post(
        `${backendUrl}/addQuestion`,
        {
          topicName: selectedTopic,
          statement,
          option1,
          option2,
          option3,
          option4,
          ansIndex: parseInt(ansIndex),
        },
        { headers: { Authorization: `Bearer ${token}` } } // Attach token in header
      );

      // Show success toast
      toast.success("Question added successfully!");

      // Reset the form
      setSelectedTopic("");
      setStatement("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setAnsIndex("0");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Handle token expiration
          if (
            error.response.data.message === "Token expired. Please login again."
          ) {
            toast.error(error.response.data.message);
          }
          navigate("/login"); // Redirect to login if status code is 401
        } else if (error.response.data.message || error.response.data.error) {
          setSubmitError(
            error.response.data.message ||
              error.response.data.error ||
              "Failed to add question."
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
      <h2 className="text-3xl font-bold mb-6">Add a New Question</h2>

      {/* Show fetch error at the top */}
      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

      {/* Add new question form */}
      <form
        onSubmit={handleAddQuestion}
        className="w-full max-w-xl p-4 bg-white shadow-md rounded-lg space-y-4"
      >
        {/* Select Topic */}
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Select Topic
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            {topics.map((topic) => (
              <option key={topic.topicId} value={topic.topicName}>
                {topic.topicName}
              </option>
            ))}
          </select>
        </div>

        {/* Input field for question statement */}
        <div>
          <label
            htmlFor="statement"
            className="block text-sm font-medium text-gray-700"
          >
            Question Statement
          </label>
          <input
            id="statement"
            name="statement"
            type="text"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Input fields for options */}
        <div>
          <label
            htmlFor="option1"
            className="block text-sm font-medium text-gray-700"
          >
            Option 1
          </label>
          <input
            id="option1"
            name="option1"
            type="text"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="option2"
            className="block text-sm font-medium text-gray-700"
          >
            Option 2
          </label>
          <input
            id="option2"
            name="option2"
            type="text"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="option3"
            className="block text-sm font-medium text-gray-700"
          >
            Option 3
          </label>
          <input
            id="option3"
            name="option3"
            type="text"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="option4"
            className="block text-sm font-medium text-gray-700"
          >
            Option 4
          </label>
          <input
            id="option4"
            name="option4"
            type="text"
            value={option4}
            onChange={(e) => setOption4(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Select Answer Index */}
        <div>
          <label
            htmlFor="ansIndex"
            className="block text-sm font-medium text-gray-700"
          >
            Correct Answer Index
          </label>
          <select
            id="ansIndex"
            value={ansIndex}
            onChange={(e) => setAnsIndex(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
          </select>
        </div>

        {/* Show submission error above the button */}
        {submitError && <p className="text-red-500 mb-4">{submitError}</p>}

        {/* Add question button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-[#FCC822] rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Question
          </button>
        </div>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddQuestion;
