import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

// 卡片学习状态
export enum LearningStatus {
  NEW = 'new',            // 新卡片
  LEARNING = 'learning',  // 学习中
  REVIEWING = 'reviewing',// 复习中
  MASTERED = 'mastered'   // 已掌握
}

// 卡片进度信息
export interface CardProgress {
  cardId: string;         // 卡片ID（通常是单词）
  status: LearningStatus; // 学习状态
  correctCount: number;   // 正确回答次数
  incorrectCount: number; // 错误回答次数
  lastReviewed: number;   // 上次复习时间戳
  nextReview: number;     // 下次复习时间戳
  easeFactor: number;     // 难易系数(SM-2算法)
  interval: number;       // 间隔天数
  repetition: number;     // 重复次数
}

// 评分等级（使用SuperMemo SM-2算法）
export enum Grade {
  FORGOT = 0,         // 完全不记得
  HARD = 1,           // 记得但很困难
  GOOD = 2,           // 记得但有些困难
  EASY = 3            // 轻松记得
}

// 间隔重复算法参数
interface SM2Params {
  minEaseFactor: number;
  maxInterval: number;
}

/**
 * 卡片进度管理hook，管理卡片的学习状态和复习计划
 */
const useCardProgress = () => {
  // 从本地存储读取所有卡片进度
  const [allCardProgress, setAllCardProgress] = useLocalStorage<Record<string, CardProgress>>('card-progress', {});
  
  // 定义SM-2算法参数
  const SM2_PARAMS: SM2Params = {
    minEaseFactor: 1.3,   // 最小难易系数
    maxInterval: 365      // 最大间隔天数
  };

  /**
   * 初始化一张卡片的进度
   * @param cardId 卡片ID
   * @returns 初始化的卡片进度对象
   */
  const initializeCard = (cardId: string): CardProgress => {
    return {
      cardId,
      status: LearningStatus.NEW,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: 0,
      nextReview: Date.now(), // 立即可复习
      easeFactor: 2.5,        // 初始难易系数
      interval: 0,
      repetition: 0
    };
  };

  /**
   * 获取指定卡片的进度
   * @param cardId 卡片ID
   * @returns 卡片进度对象
   */
  const getCardProgress = (cardId: string): CardProgress => {
    if (!allCardProgress[cardId]) {
      return initializeCard(cardId);
    }
    return allCardProgress[cardId];
  };

  /**
   * 应用SM-2间隔重复算法计算下次复习时间
   * @param card 卡片进度对象
   * @param grade 评分等级
   * @returns 更新后的卡片进度
   */
  const applySM2Algorithm = (card: CardProgress, grade: Grade): CardProgress => {
    const updatedCard = { ...card };
    
    // 如果完全忘记了，重置重复次数
    if (grade === Grade.FORGOT) {
      updatedCard.repetition = 0;
      updatedCard.interval = 0;
      updatedCard.status = LearningStatus.LEARNING;
    } else {
      // 根据评分更新重复次数
      updatedCard.repetition += 1;
      
      // 根据SM-2计算新的难易系数
      const newEaseFactor = updatedCard.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
      updatedCard.easeFactor = Math.max(SM2_PARAMS.minEaseFactor, newEaseFactor);
      
      // 计算新的间隔
      if (updatedCard.repetition === 1) {
        updatedCard.interval = 1;
      } else if (updatedCard.repetition === 2) {
        updatedCard.interval = 6;
      } else {
        // 使用SM-2公式: interval = interval * easeFactor
        updatedCard.interval = Math.min(
          SM2_PARAMS.maxInterval,
          Math.round(updatedCard.interval * updatedCard.easeFactor)
        );
      }
      
      // 更新状态
      if (updatedCard.repetition > 3 && grade === Grade.EASY) {
        updatedCard.status = LearningStatus.MASTERED;
      } else {
        updatedCard.status = LearningStatus.REVIEWING;
      }
    }
    
    // 更新复习时间戳
    updatedCard.lastReviewed = Date.now();
    updatedCard.nextReview = Date.now() + updatedCard.interval * 24 * 60 * 60 * 1000; // 转为毫秒
    
    // 更新记录
    if (grade === Grade.FORGOT) {
      updatedCard.incorrectCount += 1;
    } else {
      updatedCard.correctCount += 1;
    }
    
    return updatedCard;
  };

  /**
   * 更新卡片答题结果
   * @param cardId 卡片ID
   * @param grade 评分等级
   */
  const updateCardResult = (cardId: string, grade: Grade) => {
    const card = getCardProgress(cardId);
    const updatedCard = applySM2Algorithm(card, grade);
    
    setAllCardProgress(prev => ({
      ...prev,
      [cardId]: updatedCard
    }));
  };

  /**
   * 获取今天需要复习的卡片ID列表
   */
  const getDueCards = (): string[] => {
    const now = Date.now();
    return Object.values(allCardProgress)
      .filter(card => card.nextReview <= now)
      .map(card => card.cardId);
  };

  /**
   * 获取卡片的学习状态统计
   */
  const getProgressStats = () => {
    const total = Object.keys(allCardProgress).length;
    const newCards = Object.values(allCardProgress).filter(card => card.status === LearningStatus.NEW).length;
    const learning = Object.values(allCardProgress).filter(card => card.status === LearningStatus.LEARNING).length;
    const reviewing = Object.values(allCardProgress).filter(card => card.status === LearningStatus.REVIEWING).length;
    const mastered = Object.values(allCardProgress).filter(card => card.status === LearningStatus.MASTERED).length;
    const dueCount = getDueCards().length;
    
    return {
      total,
      newCards,
      learning,
      reviewing,
      mastered,
      dueCount
    };
  };

  /**
   * 重置卡片进度
   * @param cardId 卡片ID
   */
  const resetCardProgress = (cardId: string) => {
    setAllCardProgress(prev => ({
      ...prev,
      [cardId]: initializeCard(cardId)
    }));
  };

  /**
   * 重置所有卡片进度
   */
  const resetAllProgress = () => {
    setAllCardProgress({});
  };

  return {
    getCardProgress,
    updateCardResult,
    getDueCards,
    getProgressStats,
    resetCardProgress,
    resetAllProgress,
    LearningStatus,
    Grade
  };
};

export default useCardProgress;