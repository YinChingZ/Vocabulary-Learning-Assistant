/**
 * 测验设置常量
 * 包括默认题型、难度级别和评分标准等配置
 */

// 导入类型（如果需要引用，这里注释掉是因为没看到具体的导入路径）
// import { QuizType, QuizDifficulty } from '../types/quiz';

export const QUIZ_SETTINGS = {
  // 基础设置
  QUESTION_COUNT: 10,         // 每次测验的默认题目数量
  TIME_LIMIT: 60,             // 每题作答时间限制（秒）
  
  // 题型分布（百分比）
  TYPE_DISTRIBUTION: {
    'type-in': 0.5,           // 50% 填空题
    'choice': 0.3,            // 30% 选择题
    'drag-drop': 0.2          // 20% 拖拽题
  },
  
  // 难度级别定义
  DIFFICULTY: {
    EASY: 'easy',             // 简单难度
    MEDIUM: 'medium',         // 中等难度
    HARD: 'hard'              // 困难难度
  },
  
  // 各难度级别配置
  DIFFICULTY_SETTINGS: {
    // 填空题难度配置
    TYPE_IN: {
      EASY: {                 // 简单难度：提供首字母和下划线提示
        showFirstLetter: true,
        showUnderscores: true
      },
      MEDIUM: {               // 中等难度：仅提供首字母
        showFirstLetter: true,
        showUnderscores: false
      },
      HARD: {                 // 困难难度：无提示
        showFirstLetter: false,
        showUnderscores: false
      }
    },
    
    // 选择题选项数量
    CHOICE_OPTIONS: {
      EASY: 2,                // 简单难度：2个选项
      MEDIUM: 4,              // 中等难度：4个选项
      HARD: 6                 // 困难难度：6个选项
    },
    
    // 拖拽题项目数量
    DRAG_DROP_ITEMS: {
      EASY: 3,                // 简单难度：3个项目
      MEDIUM: 5,              // 中等难度：5个项目
      HARD: 7                 // 困难难度：7个项目
    }
  },
  
  // 评分配置
  SCORING: {
    CORRECT: 10,              // 答对得分
    INCORRECT: 0,             // 答错得分
    TIME_BONUS: 5,            // 快速回答额外奖励
    TIME_BONUS_THRESHOLD: 10  // 快速回答阈值（秒）
  },
  
  // 反馈设置
  FEEDBACK: {
    DISPLAY_TIME: 2000,       // 反馈显示时间（毫秒）
    ANIMATION_DURATION: 300   // 反馈动画持续时间（毫秒）
  }
};