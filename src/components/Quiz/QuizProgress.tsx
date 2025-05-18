import React from 'react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  showProgressBar?: boolean;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  showProgressBar = true
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          问题 {currentQuestion} / {totalQuestions}
        </span>
        <span className="text-sm font-medium">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      {showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizProgress;