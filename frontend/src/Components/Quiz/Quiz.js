import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader'; // Assuming you have a Loader component
import Result from './Result';

const Quiz = () => {
    const { topicId } = useParams(); // Fetch topicId from parameters
    const navigate = useNavigate(); // To redirect after quiz submission
    const [loading, setLoading] = useState(true); // Loading state
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10); // Timer for each question
    const [quizData, setQuizData] = useState([]); // Stores answers (questionId, topicId, status, selectedOption)
    const timerRef = useRef(null);
    const backendUrl = process.env.REACT_APP_URL;
    const [showResult, setShowResult] = useState([false]);

    // Fetch the quiz questions when the component loads
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await axios.get(`${backendUrl}/getQuestions/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuestions(response.data);
                
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                } else {
                    console.error('Error fetching quiz questions:', error);
                    setLoading(false);
                }
            }
        };

        fetchQuestions();

        // Clean up on unmount
        return () => clearInterval(timerRef.current);
    }, [topicId, navigate]);
    useEffect(() => {
        if (questions.length > 0) {
            setLoading(false);
            startTimer(); // Start the timer for the first question
        }
    }, [questions])
// Handle timeout scenario (status = 0 and no option selected)
const handleTimeout = () => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
        const questionId = questions[currentQuestionIndex].questionId;

        // Check if the question is already in quizData
        const existingIndex = quizData.findIndex((entry) => entry.questionId === questionId);

        if (existingIndex !== -1) {
            // If found, update the entry (set status to 0 for timeout)
            setQuizData((prev) => {
                let updatedQuizData = [...prev];
                updatedQuizData[existingIndex] = { questionId, topicId, status: 0, selectedOption: null };
                return updatedQuizData;
            });
        } else {
            // If not found, add a new entry for the question
            setQuizData((prev) => [
                ...prev,
                { questionId, topicId, status: 0, selectedOption: null },
            ]);
        }

        goToNextQuestion(); // Move to the next question
    }
};

    // Go to the next question or submit the quiz
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        } else {
            clearInterval(timerRef.current); // Stop the timer when the quiz ends
             // Submit the quiz when all questions are answered
        }
    console.log(currentQuestionIndex,quizData)

    };

    useEffect(() => {
        if (questions.length > 0) {
            startTimer(); // Restart the timer every time the currentQuestionIndex changes
        }
    }, [currentQuestionIndex]);

    useEffect(()=>{
        if(quizData.length===questions.length)submitQuiz();
    },[quizData])


    // Start timer only if questions are loaded and ready
    const startTimer = () => {
        clearInterval(timerRef.current); // Clear any previous timer
        setTimeLeft(10); // Reset the timer to 10 seconds
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout(); // Handle timeout when time runs out
                    return 10; // Reset the timer for the next question
                }
                return prev - 1; // Decrease time
            });
        }, 1000);
    };

    


    const handleAnswer = (selectedOptionIndex) => {
        const question = questions[currentQuestionIndex];
        const isCorrect = question.ansIndex === selectedOptionIndex ? 1 : 0;
    
        // Check if the question is already in quizData
        const existingIndex = quizData.findIndex((entry) => entry.questionId === question.questionId);
    
        if (existingIndex !== -1) {
            // If found, update the entry
            setQuizData((prev) => {
                const updatedQuizData = [...prev];
                updatedQuizData[existingIndex] = { questionId: question.questionId, topicId, status: isCorrect, selectedOption: selectedOptionIndex };
                return updatedQuizData;
            });
        } else {
            // If not found, add a new entry for the question
            setQuizData((prev) => [
                ...prev,
                { questionId: question.questionId, topicId, status: isCorrect, selectedOption: selectedOptionIndex },
            ]);
        }
    
        goToNextQuestion(); // Move to the next question
    };



    // Submit quiz to the backend
    const submitQuiz = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token
            console.log(quizData)
            const response = await axios.post(`${backendUrl}/submitQuiz`, { questions: quizData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Navigate to the result page with the score data
            setShowResult([true, response.data]);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    // If loading, show the loader
    if (loading) {
        return <Loader size={24} />;
    }

    // Render the current question
    const currentQuestion = questions[currentQuestionIndex];
    return (
        <>
            {!showResult[0] && (
                <div className="quiz-container max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <div className="timer text-xl font-bold text-right text-blue-600">
                        Time Left: {timeLeft} seconds
                    </div>
                    <div className="question-box mt-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {currentQuestion.statement}
                        </h2>
                        <div className="options mt-4 grid grid-cols-2 gap-4">
                            {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index + 1)}
                                    className={`py-2 px-4 rounded hover:bg-blue-600 ${quizData[currentQuestionIndex] && quizData[currentQuestionIndex].selectedOption === index + 1
                                        ? 'bg-green-500 text-white' // Show the selected option with a different style
                                        : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showResult[0] && <Result message={showResult[1].message} totalScore={showResult[1].totalScore} questions={questions} quizData={quizData} />}
        </>
    );
};

export default Quiz;
