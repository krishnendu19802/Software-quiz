import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTopic = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [fetchError, setFetchError] = useState(''); // Error when fetching topics
  const [submitError, setSubmitError] = useState(''); // Error when submitting new topic
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    // Fetch existing topics
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getTopics`);
        setTopics(response.data);
        setFetchError(''); // Clear any previous fetch errors
      } catch (error) {
        setFetchError('Failed to load topics.');
      }
    };

    fetchTopics();
  }, [backendUrl]);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    setSubmitError(''); // Reset error state for submission

    if (!newTopic) {
      setSubmitError('Topic name is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await axios.post(
        `${backendUrl}/addTopic`,
        { topicName: newTopic },
        { headers: { Authorization: `Bearer ${token}` } } // Attach token in header
      );

      if (response.status === 200 || response.status===201) {
        // Show success toast
        toast.success('Topic added successfully!');

        // Update topics list and clear input
        setTopics((prevTopics) => [
          ...prevTopics,
          { topicId: response.data.topicId, topicName: newTopic, questionCount: 0 },
        ]);
        setNewTopic('');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Handle token expiration
          if (error.response.data.message === 'Token expired. Please login again.') {
            toast.error(error.response.data.message);
          }
          navigate('/login'); // Redirect to login if status code is 401
        } else if (error.response.data.message || error.response.data.error) {
          setSubmitError(error.response.data.message || error.response.data.error || 'Failed to add topic.');
        } else {
          setSubmitError('Some error occurred.');
        }
      } else {
        setSubmitError('Some error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Add a New Topic</h2>

      {/* Show fetch error at the top */}
      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

      {/* Display existing topics */}
      <div className="grid gap-4 w-full max-w-xl mb-6">
        {topics.map((topic) => (
          <div
            key={topic.topicId}
            className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg"
          >
            <div className="text-lg font-semibold">{topic.topicName}</div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
              {topic.questionCount}
            </div>
          </div>
        ))}
      </div>

      {/* Add new topic form */}
      <form onSubmit={handleAddTopic} className="w-full max-w-xl p-4 bg-white shadow-md rounded-lg space-y-4">
        
        {/* Input field for new topic */}
        <div>
          <label htmlFor="newTopic" className="block text-sm font-medium text-gray-700">
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

        {/* Show submission error above the button */}
        {submitError && <p className="text-red-500 mb-4">{submitError}</p>}

        {/* Add topic button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Topic
          </button>
        </div>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddTopic;
