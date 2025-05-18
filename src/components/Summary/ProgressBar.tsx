import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  height?: string;
  animated?: boolean;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = "h-2",
  animated = true,
  showLabel = false
}) => {
  // 确保百分比在0-100之间
  const validPercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs text-gray-600 dark:text-gray-400">
          <span>进度</span>
          <span>{Math.round(validPercentage)}%</span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${validPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${height} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full`}
          />
        ) : (
          <div
            className={`${height} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full`}
            style={{ width: `${validPercentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;