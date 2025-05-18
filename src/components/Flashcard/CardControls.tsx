import React from 'react';
import { motion } from 'framer-motion';

interface CardControlsProps {
  isFlipped: boolean;
  onFlip: () => void;
  onRemembered: () => void;
  onRevision: () => void;
}

const CardControls: React.FC<CardControlsProps> = ({
  isFlipped,
  onFlip,
  onRemembered,
  onRevision
}) => {
  // 阻止事件冒泡，防止按钮点击事件触发卡片翻转
  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className="card-controls flex justify-center space-x-4">
      {!isFlipped ? (
        // 卡片正面时显示翻转按钮
        <motion.button
          className="px-6 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
          onClick={handleButtonClick(onFlip)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          翻转卡片
        </motion.button>
      ) : (
        // 卡片背面时显示"记住了"和"再看一次"按钮
        <>
          <motion.button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={handleButtonClick(onRevision)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              再看一次
            </span>
          </motion.button>
          
          <motion.button
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={handleButtonClick(onRemembered)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              记住了
            </span>
          </motion.button>
        </>
      )}
    </div>
  );
};

export default CardControls;