/**
 * 词汇相关类型定义
 * 定义了词汇卡片的数据结构和相关枚举类型
 */

// 词性枚举
export enum PartOfSpeech {
  NOUN = 'n',
  VERB = 'v',
  ADJECTIVE = 'adj',
  ADVERB = 'adv',
  PREPOSITION = 'prep',
  CONJUNCTION = 'conj',
  PRONOUN = 'pron',
  INTERJECTION = 'interj',
  OTHER = 'other'
}

// 词汇难度等级
export enum VocabularyDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 词汇标签类型
export type VocabularyTag = 
  | 'common'
  | 'academic'
  | 'difficult'
  | 'important'
  | 'custom'
  | string;

// 单词对象接口
export interface Vocabulary {
  id: string;                  // 唯一标识符
  word: string;                // 单词
  definition: string;          // 释义
  partOfSpeech?: string;       // 词性
  example?: string;            // 例句
  mnemonics?: string;          // 助记短语
  synonyms?: string[];         // 同义词
  tags?: VocabularyTag[];      // 标签
  isMarked?: boolean;          // 是否标记(收藏)
  difficulty?: VocabularyDifficulty; // 难度级别
  createdAt?: number;          // 创建时间戳
  updatedAt?: number;          // 更新时间戳
}

// 简化的词汇导入结构
export interface VocabularyImport {
  word: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
}

// 词汇过滤选项
export interface VocabularyFilter {
  searchText?: string;
  partOfSpeech?: string;
  tags?: VocabularyTag[];
  difficulty?: VocabularyDifficulty;
  onlyMarked?: boolean;
}

// 词汇排序类型
export enum VocabularySortType {
  ALPHABETICAL = 'alphabetical',
  DIFFICULTY = 'difficulty',
  DATE_ADDED = 'dateAdded',
  FAMILIARITY = 'familiarity'
}