import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const backendUrl = process.env.REACT_APP_URL;
  const navigate=useNavigate()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getTopics`);
        setTopics(response.data);
        if(error)setError('')
      } catch (error) {
        setError('Failed to load topics.');
      }
    };

    fetchTopics();
  }, [backendUrl]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Topics</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 w-full max-w-xl" >
        {topics.map((topic) => (
          <div
            key={topic.topicId}
            className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg "
            onClick={()=>{navigate(`/quiz/${topic.topicId}`)}}
          >
            <div className="text-lg font-semibold">{topic.topicName}</div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
              {topic.questionCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
