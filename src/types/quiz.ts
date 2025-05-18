/**
 * 测验相关类型定义
 * 定义了各种测验题型、难度级别和答案结构
 */

// 测验题目类型
export enum QuizType {
  TYPE_IN = 'type-in',        // 填空题
  CHOICE = 'choice',          // 选择题
  MULTI_CHOICE = 'multi-choice', // 多选题
  DRAG_DROP = 'drag-drop'     // 拖拽题
}

// 测验难度
export enum QuizDifficulty {
  EASY = 'easy',     // 容易
  MEDIUM = 'medium', // 中等
  HARD = 'hard'      // 困难
}

// 选择题选项
export interface Choice {
  id: string;          // 选项ID
  content: string;     // 选项内容
  isCorrect: boolean;  // 是否正确选项
}

// 拖拽题目的单词项
export interface DragWord {
  id: string;          // 单词ID
  content: string;     // 单词内容
}

// 拖拽题目的目标区域
export interface DropTarget {
  id: string;          // 目标区域ID
  definition: string;  // 目标区域定义文本
  answerId: string;    // 正确答案ID
}

// 测验题目基础接口
export interface QuizQuestionBase {
  id: string;                   // 题目ID
  question: string;             // 问题文本(如释义、例句等)
  answer: string;               // 正确答案
  type: QuizType;               // 题目类型
  difficulty: QuizDifficulty;   // 难度级别
  wordId: string;               // 对应的单词ID
  example?: string;             // 可选的例句(用于反馈)
}

// 填空题
export interface TypeInQuestion extends QuizQuestionBase {
  type: QuizType.TYPE_IN;
  prompt: string;      // 提示文本(如定义)
  hint?: string;       // 提示(如首字母)
}

// 选择题
export interface ChoiceQuestion extends QuizQuestionBase {
  type: QuizType.CHOICE | QuizType.MULTI_CHOICE;
  prompt: string;       // 提示文本
  choices: Choice[];    // 选项列表
}

// 拖拽题
export interface DragDropQuestion extends QuizQuestionBase {
  type: QuizType.DRAG_DROP;
  words: DragWord[];       // 可拖拽的单词列表
  targets: DropTarget[];   // 拖拽目标区域
}

// 测验题目联合类型
export type QuizQuestion = TypeInQuestion | ChoiceQuestion | DragDropQuestion;

// 用户答案记录
export interface QuizAnswer {
  questionId: string;     // 题目ID
  userAnswer: string;     // 用户答案
  isCorrect: boolean;     // 是否正确
  timeSpent?: number;     // 回答用时(毫秒)
}

// 测验结果接口
export interface QuizResult {
  quizId: string;            // 测验ID
  date: number;              // 完成时间戳
  totalQuestions: number;    // 总题数
  correctAnswers: number;    // 正确题数
  accuracy: number;          // 正确率(百分比)
  timeSpent: number;         // 总用时(毫秒)
  answers: QuizAnswer[];     // 每题的回答详情
}

// 测验类型分布比例
export interface QuizTypeDistribution {
  [QuizType.TYPE_IN]: number;      // 填空题比例
  [QuizType.CHOICE]: number;       // 选择题比例
  [QuizType.DRAG_DROP]: number;    // 拖拽题比例
  [QuizType.MULTI_CHOICE]?: number; // 多选题比例(可选)
}

// 测验配置接口
export interface QuizConfig {
  count: number;                     // 题目数量
  typeDistribution: QuizTypeDistribution; // 题型分布
  includeMarkedOnly?: boolean;       // 是否只包含标记的词汇
  difficulty?: QuizDifficulty;       // 整体难度设置
}