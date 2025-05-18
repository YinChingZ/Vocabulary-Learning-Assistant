/**
 * 存储键名常量
 * 定义localStorage使用的所有键名，避免硬编码和冲突
 */

export const STORAGE_KEYS = {
  // 核心数据
  VOCABULARY: 'vocabulary',        // 词汇列表
  PROGRESS: 'progress',            // 学习进度
  
  // 用户配置
  SETTINGS: 'settings',            // 应用设置
  THEME: 'theme',                  // 界面主题
  
  // 学习记录
  SESSIONS: 'learning_sessions',   // 学习会话记录
  STATS: 'learning_stats',         // 学习统计数据
  LAST_QUIZ: 'last_quiz_result',   // 最近测验结果
};