import React, { useState, useEffect } from 'react';
import FeedbackMessage from './FeedbackMessage';

interface TypeInQuizProps {
  question: {
    id: string;
    prompt: string; // 定义或例句
    answer: string; // 正确答案
    example?: string; // 可选的例句
  };
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
}

const TypeInQuiz: React.FC<TypeInQuizProps> = ({ question, onAnswer }) => {
  // 按字母输入框
  const [letterInputs, setLetterInputs] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // 初始化字母数组
  useEffect(() => {
    setLetterInputs(Array(question.answer.length).fill(''));
    setSubmitted(false);
  }, [question.id]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;
    const userAnswer = letterInputs.join('');
    const correct = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(correct, userAnswer);
  };

  const handleContinue = () => {
    // 重置状态，准备下一题
    setLetterInputs(Array(question.answer.length).fill(''));
    setSubmitted(false);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-lg font-medium text-gray-800">
        {question.prompt}
      </div>
      
      {/* 填字输入 */}
      {submitted ? (
        <FeedbackMessage
          isCorrect={isCorrect}
          correctAnswer={question.answer}
          userAnswer={letterInputs.join('')}
          example={question.example}
          onContinue={handleContinue}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="flex space-x-2 justify-center">
            {letterInputs.map((ch, idx) => (
              <input
                autoComplete="off"
                key={idx}
                type="text"
                maxLength={1}
                value={ch}
                onChange={e => {
                  const val = e.target.value.toLowerCase();
                  setLetterInputs(prev => {
                    const arr = [...prev];
                    arr[idx] = val;
                    return arr;
                  });
                  // 自动聚焦下一个
                  const next = document.getElementById(`letter-${idx+1}`);
                  if (val && next) (next as HTMLInputElement).focus();
                }}
                onKeyDown={e => {
                  if (e.key === 'Backspace') {
                    e.preventDefault();
                    setLetterInputs(prev => {
                      const arr = [...prev];
                      if (arr[idx]) {
                        arr[idx] = '';
                      } else if (idx > 0) {
                        arr[idx - 1] = '';
                        const prevEl = document.getElementById(`letter-${idx-1}`);
                        if (prevEl) (prevEl as HTMLInputElement).focus();
                      }
                      return arr;
                    });
                  }
                }}
                id={`letter-${idx}`}
                className="w-10 h-12 text-center text-2xl sm:text-3xl border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={letterInputs.some(c => c === '')}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >提交答案</button>
        </form>
      )}
    </div>
  );
}

export default TypeInQuiz;