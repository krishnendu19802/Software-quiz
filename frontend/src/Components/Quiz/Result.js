import React from 'react';
import { useNavigate } from 'react-router-dom';

const Result = ({ message, totalScore, questions, quizData }) => {
  const navigate = useNavigate();

  const handleRetakeQuiz = () => {
    navigate('/getTopics'); // Redirect to the topics page
  };

  return (
    <div className="result-container max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800">Quiz Result</h2>
      <div className="result-box mt-6 text-center">
        <p className="text-xl text-gray-700">{message}</p>
        <p className="text-2xl font-bold text-green-600 mt-2">Score: {totalScore}</p>
        <button
          onClick={handleRetakeQuiz}
          className="mt-6 py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Take Another Quiz
        </button>
      </div>

      {/* Scrollable window for question details */}
      <div className="mt-6 max-h-96 overflow-y-auto p-4 bg-gray-100 rounded-lg">
        {questions.map((question, index) => {
          const userAnswer = quizData[index]?.selectedOption;
          const correctAnswer = question.ansIndex;

          return (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-lg">{index + 1}. {question.statement}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[question.option1, question.option2, question.option3, question.option4].map((option, optionIndex) => {
                  const optionNumber = optionIndex + 1;

                  // Determine the class for each option
                  let optionClass = "py-2 px-4 rounded text-white";
                  if (optionNumber === correctAnswer) {
                    optionClass += " bg-green-500"; // Correct answer in green
                  } else if (userAnswer === optionNumber && userAnswer !== correctAnswer) {
                    optionClass += " bg-red-500"; // Wrong answer in red
                  } else {
                    optionClass += " bg-blue-500"; // Default option in blue
                  }

                  return (
                    <div key={optionIndex} className={optionClass}>
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Result;
