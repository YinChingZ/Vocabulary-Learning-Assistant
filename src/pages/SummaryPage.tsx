import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 导入组件
import ProgressBar from '../components/Summary/ProgressBar';
import StatsCard from '../components/Summary/StatsCard';
import StatsChart from '../components/Summary/StatsChart';
import RevisionList from '../components/Summary/RevisionList';
import Button from '../components/common/Button';

// 导入上下文、工具
import VocabularyContext from '../context/VocabularyContext';
import ProgressContext from '../context/ProgressContext';
import { ROUTES } from '../constants/routes';

// 定义统计数据类型
interface Stats {
  total: number;
  completed: number;
  correct: number;
  accuracy: number;
  lastSessions: {
    date: string;
    accuracy: number;
  }[];
}

const SummaryPage: React.FC = () => {
  // 状态管理
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    correct: 0,
    accuracy: 0,
    lastSessions: []
  });
  const [needRevisionWords, setNeedRevisionWords] = useState<string[]>([]);
  
  // 上下文
  const { vocabulary } = useContext(VocabularyContext);
  const { progress } = useContext(ProgressContext);
  const navigate = useNavigate();

  // 初始化统计数据
  useEffect(() => {
    if (progress) {
      // 计算正确率（记住比例）
      const accuracy = progress.total > 0
        ? Math.round((progress.completed / progress.total) * 100)
        : 0;
      
      // 假设我们有一些历史会话数据
      const mockSessions = [
        { date: '5/10', accuracy: 65 },
        { date: '5/12', accuracy: 72 },
        { date: '5/14', accuracy: 78 },
        { date: '今天', accuracy }
      ];
      
      setStats({
        total: progress.total,
        completed: progress.completed,
        correct: progress.correct,
        accuracy,
        lastSessions: mockSessions
      });
      
      // 这里可以添加逻辑来确定哪些单词需要复习
      // 实际项目中，这可能基于用户在测验或闪卡中的表现
      if (vocabulary && vocabulary.length > 0) {
        // 模拟一些需要复习的单词
        const sampleSize = Math.min(5, vocabulary.length);
        const revisionSample = vocabulary
          .slice(0, sampleSize)
          .map(item => item.word);
        setNeedRevisionWords(revisionSample);
      }
    }
  }, [progress, vocabulary]);

  // 导航处理
  const goToFlashcards = () => {
    navigate(ROUTES.FLASHCARD);
  };
  
  const goToQuiz = () => {
    navigate(ROUTES.QUIZ);
  };
  
  const goToImport = () => {
    navigate(ROUTES.IMPORT);
  };

  // 渲染学习建议
  const renderLearningAdvice = () => {
    const { accuracy } = stats;
    
    if (accuracy >= 85) {
      return {
        title: '优秀!',
        message: '你的掌握度非常高，建议尝试更难的词汇或进行巩固练习。',
        icon: '🏆'
      };
    } else if (accuracy >= 70) {
      return {
        title: '不错!',
        message: '你已经取得了良好进展，建议重点复习错误较多的词汇。',
        icon: '👍'
      };
    } else {
      return {
        title: '继续努力!',
        message: '多复习可以提高记忆效率，建议分批次重复学习这些词汇。',
        icon: '💪'
      };
    }
  };
  
  const advice = renderLearningAdvice();

  return (
    <motion.div
      className="summary-page container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">学习总结</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* 总体进度卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">整体进度</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm">
              <span>学习进度</span>
              <span>{stats.completed} / {stats.total} 个词汇</span>
            </div>
            <ProgressBar percentage={(stats.completed / Math.max(stats.total, 1)) * 100} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              title="正确率" 
              value={`${stats.accuracy}%`} 
              iconName="check-circle"
              color="text-green-500"
            />
            <StatsCard 
              title="已完成" 
              value={stats.completed.toString()} 
              iconName="book-open"
              color="text-blue-500"
            />
          </div>
        </div>
        
        {/* 趋势图表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">学习趋势</h2>
          <StatsChart data={stats.lastSessions} />
        </div>
        
        {/* 学习建议 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">学习建议</h2>
          
          <div className="flex items-start mb-4">
            <span className="text-3xl mr-4">{advice.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{advice.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{advice.message}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold mb-2">下一步计划</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>重点复习标记的困难词汇</li>
              <li>尝试不同类型的测验来巩固记忆</li>
              <li>定期回顾以提高长期记忆</li>
            </ul>
          </div>
        </div>
        
        {/* 需要复习的单词 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">需要重点复习</h2>
          {needRevisionWords.length > 0 ? (
            <RevisionList words={needRevisionWords} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">暂无需要特别复习的单词</p>
          )}
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
        <Button
          label="继续闪卡学习"
          onClick={goToFlashcards}
          className="bg-blue-500 hover:bg-blue-600"
        />
        <Button
          label="再次测验"
          onClick={goToQuiz}
          className="bg-green-500 hover:bg-green-600"
        />
        <Button
          label="导入新词汇"
          onClick={goToImport}
          className="bg-gray-500 hover:bg-gray-600"
        />
      </div>
    </motion.div>
  );
};

export default SummaryPage;