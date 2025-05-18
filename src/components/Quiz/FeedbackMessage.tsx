import React from 'react';

interface FeedbackMessageProps {
  isCorrect: boolean;
  correctAnswer?: string;
  userAnswer?: string;
  example?: string;
  onContinue: () => void;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  isCorrect,
  correctAnswer,
  userAnswer,
  example,
  onContinue
}) => {
  return (
    <div className={`w-full p-4 rounded-md mb-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-start">
        {isCorrect ? (
          <div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        
        <div>
          <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? '回答正确！' : '回答错误'}
          </p>
          
          {!isCorrect && correctAnswer && (
            <div className="mt-2 text-sm text-gray-700">
              <p>正确答案: <span className="font-medium">{correctAnswer}</span></p>
              {userAnswer && <p>您的回答: <span className="font-medium">{userAnswer}</span></p>}
            </div>
          )}
          
          {example && (
            <div className="mt-3 text-sm text-gray-600 border-l-2 border-gray-300 pl-3 italic">
              例句: {example}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-right">
        <button
          onClick={onContinue}
          className={`px-4 py-2 rounded-md text-white text-sm font-medium transition
            ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          继续
        </button>
      </div>
    </div>
  );
};

export default FeedbackMessage;