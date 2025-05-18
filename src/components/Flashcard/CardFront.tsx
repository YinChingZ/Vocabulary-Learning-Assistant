import React from 'react';
import { motion } from 'framer-motion';

interface CardFrontProps {
  word: string;
  partOfSpeech?: string;
  onSpeechPlay: () => void;
}

const CardFront: React.FC<CardFrontProps> = ({ word, partOfSpeech, onSpeechPlay }) => {
  // 阻止事件冒泡，防止点击发音按钮时翻转卡片
  const handleSpeechClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeechPlay();
  };

  return (
    <div className="card-front bg-white dark:bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center">
      <div className="w-full text-center">
        {/* 词性标签 */}
        {partOfSpeech && (
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded mb-2">
            {partOfSpeech}
          </span>
        )}
        
        {/* 单词 */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{word}</h2>
        
        {/* 发音按钮 */}
        <motion.button
          className="mt-4 w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-full transition-colors"
          onClick={handleSpeechClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="播放发音"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </motion.button>
        
        {/* 提示信息 */}
        <div className="mt-8 text-sm text-gray-400 dark:text-gray-500">
          点击卡片查看释义
        </div>
      </div>
    </div>
  );
};

export default CardFront;