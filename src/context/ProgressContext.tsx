import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';

// 定义进度类型
export interface Progress {
  total: number;          // 总词汇量
  completed: number;      // 已完成的词汇量
  correct: number;        // 正确回答的次数
  incorrect: number;      // 错误回答的次数
  wordProgress?: {        // 每个单词的进度
    [wordId: string]: {
      reviewCount: number;       // 复习次数
      correctCount: number;      // 正确回答次数
      lastReviewed: number;      // 最后复习时间戳
      nextReviewTime: number;    // 下次复习时间戳
      familiarity: number;       // 熟悉度 (0-100)
    }
  };
  lastSessions?: Array<{  // 最近学习记录
    date: string;
    accuracy: number;
    wordsStudied: number;
  }>;
}

// 定义上下文类型
interface ProgressContextType {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
  updateWordProgress: (wordId: string, isCorrect: boolean) => void;
  getWordProgress: (wordId: string) => NonNullable<Progress['wordProgress']>[string] | undefined;
  resetProgress: () => void;
  addSession: (accuracy: number, wordsStudied: number) => void;
  getWordsForReview: () => string[]; // 返回需要复习的单词ID
}

// 创建初始状态
const initialProgress: Progress = {
  total: 0,
  completed: 0,
  correct: 0,
  incorrect: 0,
  wordProgress: {},
  lastSessions: []
};

// 创建上下文
export const ProgressContext = createContext<ProgressContextType>({
  progress: initialProgress,
  setProgress: () => {},
  updateWordProgress: () => {},
  getWordProgress: () => undefined,
  resetProgress: () => {},
  addSession: () => {},
  getWordsForReview: () => []
});

// 上下文提供者组件
interface ProgressProviderProps {
  children: ReactNode;
  initialValue?: Progress;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
  initialValue = initialProgress
}) => {
  const [progress, setProgress] = useState<Progress>(initialValue);

  // 从本地存储加载进度
  useEffect(() => {
    const storedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (storedProgress) {
      try {
        const parsedProgress = JSON.parse(storedProgress);
        setProgress(parsedProgress);
      } catch (error) {
        console.error('加载进度数据失败:', error);
      }
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, [progress]);

  // 更新单词进度
  const updateWordProgress = (wordId: string, isCorrect: boolean) => {
    setProgress(prev => {
      const now = Date.now();
      const wordProgress = prev.wordProgress || {};
      const currentWordProgress = wordProgress[wordId] || {
        reviewCount: 0,
        correctCount: 0,
        lastReviewed: 0,
        nextReviewTime: 0,
        familiarity: 0
      };

      // 计算间隔时间（根据间隔重复算法）
      const reviewCount = currentWordProgress.reviewCount + 1;
      const correctCount = isCorrect 
        ? currentWordProgress.correctCount + 1 
        : currentWordProgress.correctCount;
      
      // 计算熟悉度 (0-100)
      const familiarity = Math.min(
        100,
        Math.round((correctCount / Math.max(reviewCount, 1)) * 100)
      );

      // 计算下次复习时间（简化的间隔重复算法）
      // 熟悉度越高，复习间隔越长
      const intervals = [
        1 * 60 * 60 * 1000,       // 1小时
        6 * 60 * 60 * 1000,       // 6小时
        24 * 60 * 60 * 1000,      // 1天
        3 * 24 * 60 * 60 * 1000,  // 3天
        7 * 24 * 60 * 60 * 1000,  // 1周
        14 * 24 * 60 * 60 * 1000, // 2周
        30 * 24 * 60 * 60 * 1000  // 1个月
      ];

      const intervalLevel = Math.min(
        intervals.length - 1, 
        isCorrect ? Math.floor(familiarity / 20) : 0
      );
      
      const nextReviewTime = now + intervals[intervalLevel];

      return {
        ...prev,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
        wordProgress: {
          ...wordProgress,
          [wordId]: {
            reviewCount,
            correctCount,
            lastReviewed: now,
            nextReviewTime,
            familiarity
          }
        }
      };
    });
  };

  // 获取单词进度
  const getWordProgress = (wordId: string) => {
    return progress.wordProgress?.[wordId];
  };

  // 重置进度
  const resetProgress = () => {
    setProgress(initialProgress);
  };

  // 添加学习记录
  const addSession = (accuracy: number, wordsStudied: number) => {
    const today = new Date().toLocaleDateString();
    
    setProgress(prev => {
      const lastSessions = [...(prev.lastSessions || [])];
      
      // 如果今天已有记录，则更新
      const todaySessionIndex = lastSessions.findIndex(s => s.date === today);
      if (todaySessionIndex !== -1) {
        const todaySession = lastSessions[todaySessionIndex];
        lastSessions[todaySessionIndex] = {
          date: today,
          accuracy: Math.round((todaySession.accuracy + accuracy) / 2), // 平均准确率
          wordsStudied: todaySession.wordsStudied + wordsStudied
        };
      } else {
        // 保持最近5个记录
        if (lastSessions.length >= 5) {
          lastSessions.shift();
        }
        lastSessions.push({
          date: today,
          accuracy,
          wordsStudied
        });
      }
      
      return {
        ...prev,
        lastSessions
      };
    });
  };

  // 获取需要复习的单词列表
  const getWordsForReview = () => {
    const now = Date.now();
    const wordProgress = progress.wordProgress || {};
    
    return Object.entries(wordProgress)
      .filter(([_, data]) => data.nextReviewTime <= now)
      .map(([wordId, _]) => wordId);
  };

  const contextValue: ProgressContextType = {
    progress,
    setProgress,
    updateWordProgress,
    getWordProgress,
    resetProgress,
    addSession,
    getWordsForReview
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;