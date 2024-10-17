import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Loader from '../Loader/Loader';


const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null); // To hold the profile data
    const [loading, setLoading] = useState(true); // Loader state
    const navigate = useNavigate(); // For navigation
    const backendUrl=process.env.REACT_APP_URL

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
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
                    navigate('/login'); // Navigate to login if unauthorized
                } else {
                    toast.error('Error occurred while fetching profile data'); // Show toast error for any other errors
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
    const { name, email, lastQuestions, lastQuizzes, score, rank } = profileData || {};

    return (
        <div className="profile-page p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            {/* User Information */}
            <div className="profile-info bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <p className="text-gray-700">Name: <span className="font-semibold">{name}</span></p>
                <p className="text-gray-700">Email: <span className="font-semibold">{email}</span></p>
                <p className="text-gray-700">Score: <span className="font-semibold">{score}</span></p>
                <p className="text-gray-700">Rank: <span className="font-semibold">#{rank}</span></p>
            </div>

            {/* Last Questions Attempted */}
            <div className="last-questions bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Last Questions Attempted</h2>
                <ul className="divide-y divide-gray-200">
                    {lastQuestions?.map((question, index) => (
                        <li key={index} className="py-4">
                            <p className="text-gray-700">
                                <span className="font-semibold">{question.topicName}</span> - Question ID: {question.questionId} | 
                                Status: {question.status === 1 ? 'Correct' : 'Incorrect'}
                            </p>
                            <p className="text-gray-500 text-sm">Attempted at: {new Date(question.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Last Quizzes Attempted */}
            <div className="last-quizzes bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Last Quizzes Attempted</h2>
                <ul className="divide-y divide-gray-200">
                    {lastQuizzes?.map((quiz, index) => (
                        <li key={index} className="py-4">
                            <p className="text-gray-700">Quiz ID: {quiz.quizId} | Score: {quiz.score}</p>
                            <p className="text-gray-500 text-sm">Attempted at: {new Date(quiz.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Toast Notification for Error Messages */}
            <ToastContainer />
        </div>
    );
};

export default ProfilePage;
