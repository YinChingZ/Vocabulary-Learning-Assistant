/**
 * 学习进度相关类型定义
 * 定义了学习进度、会话记录和统计数据结构
 */

// 学习状态枚举
export enum LearningStatus {
  NEW = 'new',            // 新卡片
  LEARNING = 'learning',  // 学习中
  REVIEWING = 'reviewing',// 复习中
  MASTERED = 'mastered'   // 已掌握
}

// 评分等级(用于SuperMemo SM-2算法)
export enum Grade {
  FORGOT = 0,         // 完全不记得
  HARD = 1,           // 记得但很困难
  GOOD = 2,           // 记得但有些困难
  EASY = 3            // 轻松记得
}

// 单词学习进度
export interface WordProgress {
  reviewCount: number;       // 复习次数
  correctCount: number;      // 正确回答次数
  incorrectCount: number;    // 错误回答次数
  lastReviewed: number;      // 最后复习时间戳
  nextReviewTime: number;    // 下次复习时间戳
  familiarity: number;       // 熟悉度(0-100)
  status: LearningStatus;    // 学习状态
}

// 卡片进度详细信息(SM2算法使用)
export interface CardProgress {
  cardId: string;         // 卡片ID(通常是单词ID)
  status: LearningStatus; // 学习状态
  correctCount: number;   // 正确回答次数
  incorrectCount: number; // 错误回答次数
  lastReviewed: number;   // 上次复习时间戳
  nextReview: number;     // 下次复习时间戳
  easeFactor: number;     // 难易系数(SM-2算法)
  interval: number;       // 间隔天数
  repetition: number;     // 重复次数
}

// 学习会话记录
export interface LearningSession {
  date: string;          // 日期(格式化为易读形式)
  timestamp: number;     // 时间戳
  wordsStudied: number;  // 学习的单词数量
  accuracy: number;      // 正确率(百分比)
  timeSpent?: number;    // 学习时长(秒)
}

// 整体学习进度
export interface Progress {
  total: number;          // 总词汇量
  completed: number;      // 已完成的词汇量
  correct: number;        // 正确回答的次数
  incorrect: number;      // 错误回答的次数
  wordProgress?: {        // 每个单词的进度
    [wordId: string]: WordProgress;
  };
  lastSessions?: LearningSession[]; // 最近学习记录
}

// 学习统计摘要
export interface LearningStats {
  total: number;            // 总词汇量
  completed: number;        // 已完成词汇量
  correct: number;          // 正确数
  accuracy: number;         // 正确率(百分比)
  streak?: number;          // 连续学习天数
  lastSessions: {           // 最近会话简要记录
    date: string;
    accuracy: number;
  }[];
  masterCount?: number;     // 已掌握的词汇数量
  reviewingCount?: number;  // 正在复习的词汇数量
  newCount?: number;        // 新词汇数量
}

// 学习时间点记录(用于展示学习频率)
export interface LearningTimepoint {
  date: string;            // 日期(YYYY-MM-DD)
  count: number;           // 该日完成的单词数量
}

// 复习计划
export interface ReviewSchedule {
  today: string[];         // 今天需要复习的单词ID
  tomorrow: string[];      // 明天需要复习的单词ID
  thisWeek: string[];      // 本周需要复习的单词ID
  later: string[];         // 更远将来需要复习的单词ID
}