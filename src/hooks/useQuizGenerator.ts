import { useState, useCallback } from 'react';
import useCardProgress, { Grade, LearningStatus } from './useCardProgress';

// 测验题目类型
export enum QuizType {
  TYPE_IN = 'type-in',        // 填空题
  CHOICE = 'choice',          // 选择题
  MULTI_CHOICE = 'multi-choice', // 多选题
  DRAG_DROP = 'drag-drop'     // 拖拽题
}

// 测验难度
export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 选择题选项
export interface Choice {
  id: string;
  content: string;
  isCorrect: boolean;
}

// 拖拽题目的单词项
export interface DragWord {
  id: string;
  content: string;
}

// 拖拽题目的目标区域
export interface DropTarget {
  id: string;
  definition: string;
  answerId: string;
}

// 测验题目基础接口
export interface QuizQuestionBase {
  id: string;
  question: string;  // 问题文本（如释义、例句等）
  answer: string;    // 正确答案
  type: QuizType;    // 题目类型
  difficulty: QuizDifficulty; // 难度
  wordId: string;    // 对应的单词ID
}

// 填空题
export interface TypeInQuestion extends QuizQuestionBase {
  type: QuizType.TYPE_IN;
  hint?: string;     // 提示（如首字母）
}

// 选择题
export interface ChoiceQuestion extends QuizQuestionBase {
  type: QuizType.CHOICE | QuizType.MULTI_CHOICE;
  choices: Choice[];  // 选项列表
}

// 拖拽题
export interface DragDropQuestion extends QuizQuestionBase {
  type: QuizType.DRAG_DROP;
  words: DragWord[];      // 可拖拽的单词列表
  targets: DropTarget[];  // 拖拽目标区域
}

// 所有题目类型的联合类型
export type QuizQuestion = TypeInQuestion | ChoiceQuestion | DragDropQuestion;

// 词汇项接口
export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  synonyms?: string[];
  mnemonics?: string;
}

/**
 * 测验生成hook，用于生成不同类型的测验题目
 */
const useQuizGenerator = () => {
  const [lastGeneratedQuiz, setLastGeneratedQuiz] = useState<QuizQuestion[]>([]);
  const { getCardProgress, getProgressStats } = useCardProgress();

  /**
   * 打乱数组
   * @param array 要打乱的数组
   * @returns 打乱后的新数组
   */
  const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  /**
   * 生成填空题
   * @param vocab 词汇项
   * @param difficulty 难度
   * @returns 填空题对象
   */
  const generateTypeInQuestion = (vocab: VocabularyItem, difficulty: QuizDifficulty): TypeInQuestion => {
    // 根据难度生成不同的提示
    let hint = undefined;
    
    if (difficulty === QuizDifficulty.EASY) {
      // 简单难度提供首字母提示
      hint = vocab.word.charAt(0) + '____';
    } else if (difficulty === QuizDifficulty.MEDIUM) {
      // 中等难度只提供首字母
      hint = vocab.word.charAt(0);
    }
    
    return {
      id: `typein-${vocab.id}`,
      type: QuizType.TYPE_IN,
      question: vocab.definition,
      answer: vocab.word,
      difficulty,
      wordId: vocab.id,
      hint
    };
  };

  /**
   * 生成选择题
   * @param vocab 当前词汇项
   * @param allVocab 所有词汇列表（用于生成干扰选项）
   * @param difficulty 难度
   * @returns 选择题对象
   */
  const generateChoiceQuestion = (
    vocab: VocabularyItem, 
    allVocab: VocabularyItem[],
    difficulty: QuizDifficulty
  ): ChoiceQuestion => {
    // 根据难度确定选项数量
    const optionCount = difficulty === QuizDifficulty.EASY ? 2 : 
                        difficulty === QuizDifficulty.MEDIUM ? 4 : 6;
    
    // 过滤掉当前词汇，并选择一些作为干扰项
    const otherVocab = allVocab.filter(v => v.id !== vocab.id);
    
    // 根据难度选择干扰项
    let distractors: VocabularyItem[] = [];
    
    if (difficulty === QuizDifficulty.EASY) {
      // 简单：随机选择
      distractors = shuffleArray(otherVocab).slice(0, optionCount - 1);
    } else if (difficulty === QuizDifficulty.MEDIUM) {
      // 中等：优先选择相同词性的词
      const samePos = otherVocab.filter(v => v.partOfSpeech === vocab.partOfSpeech);
      const samePosCount = Math.min(samePos.length, optionCount - 2);
      
      distractors = [
        ...shuffleArray(samePos).slice(0, samePosCount),
        ...shuffleArray(otherVocab.filter(v => v.partOfSpeech !== vocab.partOfSpeech))
          .slice(0, optionCount - 1 - samePosCount)
      ];
    } else {
      // 困难：优先选择同义词或相关词
      const relatedWords = otherVocab.filter(v => 
        vocab.synonyms?.includes(v.word) || 
        v.synonyms?.includes(vocab.word) ||
        v.partOfSpeech === vocab.partOfSpeech
      );
      
      const relatedCount = Math.min(relatedWords.length, optionCount - 2);
      
      distractors = [
        ...shuffleArray(relatedWords).slice(0, relatedCount),
        ...shuffleArray(otherVocab.filter(v => !relatedWords.includes(v)))
          .slice(0, optionCount - 1 - relatedCount)
      ];
    }
    
    // 构建选项
    const choices: Choice[] = [
      { id: vocab.id, content: vocab.word, isCorrect: true },
      ...distractors.map(v => ({ id: v.id, content: v.word, isCorrect: false }))
    ];
    
    // 打乱选项顺序
    const shuffledChoices = shuffleArray(choices);
    
    return {
      id: `choice-${vocab.id}`,
      type: optionCount > 4 ? QuizType.MULTI_CHOICE : QuizType.CHOICE,
      question: vocab.definition,
      answer: vocab.word,
      difficulty,
      wordId: vocab.id,
      choices: shuffledChoices
    };
  };

  /**
   * 生成拖拽题
   * @param vocab 当前词汇项
   * @param allVocab 所有词汇列表
   * @param difficulty 难度
   * @returns 拖拽题对象
   */
  const generateDragDropQuestion = (
    vocab: VocabularyItem, 
    allVocab: VocabularyItem[],
    difficulty: QuizDifficulty
  ): DragDropQuestion => {
    // 确定题目中的单词和定义数量
    const itemCount = difficulty === QuizDifficulty.EASY ? 3 : 
                      difficulty === QuizDifficulty.MEDIUM ? 5 : 7;
    
    // 选择一些其他词汇作为干扰项
    const otherVocab = shuffleArray(
      allVocab.filter(v => v.id !== vocab.id)
    ).slice(0, itemCount - 1);
    
    // 将当前词汇和干扰项合并
    const questionVocab = [vocab, ...otherVocab];
    
    // 构建单词和目标区域
    const words: DragWord[] = shuffleArray(questionVocab.map(v => ({
      id: v.id,
      content: v.word
    })));
    
    const targets: DropTarget[] = shuffleArray(questionVocab.map(v => ({
      id: `target-${v.id}`,
      definition: v.definition,
      answerId: v.id
    })));
    
    return {
      id: `dragdrop-${vocab.id}`,
      type: QuizType.DRAG_DROP,
      question: "将单词拖放到对应的释义上",
      answer: vocab.word, // 主要答案仍是当前词汇
      difficulty,
      wordId: vocab.id,
      words,
      targets
    };
  };

  /**
   * 生成测验题目
   * @param vocabulary 词汇列表
   * @param count 题目数量
   * @param typeDistribution 题型分布（可选）
   * @returns 测验题目数组
   */
  const generateQuiz = useCallback((
    vocabulary: VocabularyItem[],
    count: number = 10,
    typeDistribution?: Record<QuizType, number>
  ): QuizQuestion[] => {
    if (!vocabulary || vocabulary.length === 0) {
      return [];
    }
    
    // 确保不超过词汇总数
    const actualCount = Math.min(count, vocabulary.length);
    
    // 默认题型分布
    const distribution = typeDistribution || {
      [QuizType.TYPE_IN]: 0.5,     // 50% 填空题
      [QuizType.CHOICE]: 0.3,      // 30% 选择题
      [QuizType.DRAG_DROP]: 0.2    // 20% 拖拽题
    };
    
    // 根据学习进度选择词汇
    const vocabWithProgress = vocabulary.map(v => {
      const progress = getCardProgress(v.id);
      return { vocab: v, progress };
    });
    
    // 排序优先选择：1.需要复习的 2.新的 3.已掌握的
    vocabWithProgress.sort((a, b) => {
      // 需要复习的优先
      if (a.progress.status === LearningStatus.REVIEWING && 
          b.progress.status !== LearningStatus.REVIEWING) {
        return -1;
      }
      if (b.progress.status === LearningStatus.REVIEWING && 
          a.progress.status !== LearningStatus.REVIEWING) {
        return 1;
      }
      
      // 新的次之
      if (a.progress.status === LearningStatus.NEW && 
          b.progress.status !== LearningStatus.NEW) {
        return -1;
      }
      if (b.progress.status === LearningStatus.NEW && 
          a.progress.status !== LearningStatus.NEW) {
        return 1;
      }
      
      // 错误率高的优先
      const aErrorRate = a.progress.incorrectCount / (a.progress.correctCount + a.progress.incorrectCount || 1);
      const bErrorRate = b.progress.incorrectCount / (b.progress.correctCount + b.progress.incorrectCount || 1);
      
      return bErrorRate - aErrorRate;
    });
    
    // 选择要出题的词汇
    const selectedVocab = vocabWithProgress.slice(0, actualCount).map(v => v.vocab);
    
    // 计算每种题型的数量
    const typeInCount = Math.round(actualCount * distribution[QuizType.TYPE_IN]);
    const choiceCount = Math.round(actualCount * distribution[QuizType.CHOICE]);
    const dragDropCount = actualCount - typeInCount - choiceCount;
    
    const quiz: QuizQuestion[] = [];
    
    // 生成填空题
    for (let i = 0; i < typeInCount && i < selectedVocab.length; i++) {
      const vocab = selectedVocab[i];
      const progress = getCardProgress(vocab.id);
      
      // 根据学习进度确定难度
      let difficulty: QuizDifficulty;
      if (progress.status === LearningStatus.NEW || progress.correctCount === 0) {
        difficulty = QuizDifficulty.EASY;
      } else if (progress.incorrectCount > progress.correctCount) {
        difficulty = QuizDifficulty.MEDIUM;
      } else {
        difficulty = QuizDifficulty.HARD;
      }
      
      quiz.push(generateTypeInQuestion(vocab, difficulty));
    }
    
    // 生成选择题
    for (let i = typeInCount; i < typeInCount + choiceCount && i < selectedVocab.length; i++) {
      const vocab = selectedVocab[i];
      const progress = getCardProgress(vocab.id);
      
      // 根据学习进度确定难度
      let difficulty: QuizDifficulty;
      if (progress.status === LearningStatus.NEW || progress.correctCount < 2) {
        difficulty = QuizDifficulty.EASY;
      } else if (progress.incorrectCount > progress.correctCount / 2) {
        difficulty = QuizDifficulty.MEDIUM;
      } else {
        difficulty = QuizDifficulty.HARD;
      }
      
      quiz.push(generateChoiceQuestion(vocab, vocabulary, difficulty));
    }
    
    // 生成拖拽题
    for (let i = typeInCount + choiceCount; i < actualCount && i < selectedVocab.length; i++) {
      const vocab = selectedVocab[i];
      const progress = getCardProgress(vocab.id);
      
      // 根据学习进度确定难度
      let difficulty: QuizDifficulty;
      if (progress.status === LearningStatus.NEW || progress.correctCount < 3) {
        difficulty = QuizDifficulty.EASY;
      } else if (progress.incorrectCount > 0) {
        difficulty = QuizDifficulty.MEDIUM;
      } else {
        difficulty = QuizDifficulty.HARD;
      }
      
      quiz.push(generateDragDropQuestion(vocab, vocabulary, difficulty));
    }
    
    // 保存生成的测验
    setLastGeneratedQuiz(quiz);
    
    return shuffleArray(quiz);
  }, [getCardProgress]);

  /**
   * 获取上次生成的测验
   * @returns 上次生成的测验题目数组
   */
  const getLastGeneratedQuiz = () => {
    return lastGeneratedQuiz;
  };
  
  return {
    generateQuiz,
    getLastGeneratedQuiz,
    QuizType,
    QuizDifficulty
  };
};

export default useQuizGenerator;