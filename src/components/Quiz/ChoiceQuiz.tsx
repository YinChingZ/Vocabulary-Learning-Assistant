import React, { useEffect, useState } from 'react';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ChoiceQuizProps {
  question: {
    id: string;
    prompt: string; // 定义或例句
    choices: Choice[];
    example?: string; // 可选的例句
  };
  onAnswer: (isCorrect: boolean, choiceId: string) => void;
}

const ChoiceQuiz: React.FC<ChoiceQuizProps> = ({ question, onAnswer }) => {
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);

  // 打乱选项顺序
  useEffect(() => {
    const shuffled = [...question.choices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledChoices(shuffled);
  }, [question.choices]);
  
  const handleChoiceClick = (choiceId: string) => {
    const correct = question.choices.find(choice => choice.id === choiceId)?.isCorrect || false;
    onAnswer(correct, choiceId);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-lg font-medium text-gray-800">
        {question.prompt}
      </div>
      <div className="space-y-3">
        {shuffledChoices.map(choice => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice.id)}
            className="w-full p-4 text-left rounded-md border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChoiceQuiz;