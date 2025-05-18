import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[80vh] text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      </div>
      
      <h2 className="text-3xl font-bold mb-4">页面不存在</h2>
      
      <p className="mb-8 text-gray-600 dark:text-gray-400 max-w-md">
        您访问的页面不存在或已被移除。请返回首页继续浏览。
      </p>
      
      <div className="flex gap-4">
        <Link to={ROUTES.IMPORT} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
          返回首页
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
        >
          返回上一页
        </button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;