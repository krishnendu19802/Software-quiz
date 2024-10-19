import React from "react";
import { useNavigate } from "react-router-dom";

const Result = ({ message, totalScore, questions, quizData }) => {
  const navigate = useNavigate();

  const handleRetakeQuiz = () => {
    navigate("/getTopics"); // Redirect to the topics page
  };

  return (
    <div className="result-container max-w-7xl mx-auto mt-10 p-6 bg-white flex">
      {/* Left Side: Answers and Questions */}
      <div className="answers-container w-2/3 pr-6 max-h-screen overflow-y-auto">
        {/* Scrollable window for question details */}
        <div className="p-4 bg-[#f7f2e6] rounded-lg">
          {questions.map((question, index) => {
            const userAnswer = quizData[index]?.selectedOption;
            const correctAnswer = question.ansIndex;

            return (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-lg">
                  {index + 1}. {question.statement}
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    question.option1,
                    question.option2,
                    question.option3,
                    question.option4,
                  ].map((option, optionIndex) => {
                    const optionNumber = optionIndex + 1;

                    // Determine the class for each option
                    let optionClass = "py-2 px-4 rounded ";
                    if (optionNumber === correctAnswer) {
                      optionClass += " bg-green-500 text-white"; // Correct answer in green
                    } else if (
                      userAnswer === optionNumber &&
                      userAnswer !== correctAnswer
                    ) {
                      optionClass += " bg-red-500 text-white"; // Wrong answer in red
                    } else {
                      optionClass += " bg-[#fdd05f] text-black"; // Default option in yellow
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

      {/* Right Side: Quiz Result */}
      <div className="result-box w-1/3 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Quiz Result
        </h2>
        <div className="mt-6 text-center">
          <p className="text-xl text-gray-700">{message}</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            Score: {totalScore}
          </p>
          <button
            onClick={handleRetakeQuiz}
            className="mt-6 py-2 px-6 bg-[#FCC822] text-white rounded hover:bg-[#e6b81f]"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
