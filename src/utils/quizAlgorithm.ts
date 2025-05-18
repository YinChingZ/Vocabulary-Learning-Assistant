import { Vocabulary } from '../types/vocabulary';
import { 
  QuizQuestion, 
  TypeInQuestion, 
  ChoiceQuestion, 
  DragDropQuestion,
  QuizType,
  QuizDifficulty,
  QuizTypeDistribution
} from '../types/quiz';
import { LearningStatus } from '../hooks/useCardProgress';
import { shuffleCards } from './cardUtils';

/**
 * 生成唯一ID
 * @returns 唯一字符串ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 生成填空题
 * @param vocab 单词对象
 * @param difficulty 难度级别
 * @returns 填空题对象
 */
export const generateTypeInQuestion = (
  vocab: Vocabulary, 
  difficulty: QuizDifficulty = QuizDifficulty.MEDIUM
): TypeInQuestion => {
  let hint = '';
  
  // 根据难度提供不同程度的提示
  if (difficulty === QuizDifficulty.EASY) {
    hint = vocab.word.charAt(0) + '___';
  } else if (difficulty === QuizDifficulty.MEDIUM) {
    // 只提示首字母
    hint = vocab.word.charAt(0);
  }
  
  return {
    id: generateId(),
    type: QuizType.TYPE_IN,
    wordId: vocab.id,
    question: `请输入与以下释义相符的单词：${vocab.definition}`,
    answer: vocab.word,
    difficulty,
    prompt: vocab.definition,
    ...(hint && { hint })
  };
};

/**
 * 生成选择题
 * @param vocab 目标单词
 * @param allVocab 所有单词列表(用于生成干扰项)
 * @param difficulty 难度级别
 * @returns 选择题对象
 */
export const generateChoiceQuestion = (
  vocab: Vocabulary, 
  allVocab: Vocabulary[],
  difficulty: QuizDifficulty = QuizDifficulty.MEDIUM
): ChoiceQuestion => {
  // 选项数量根据难度调整
  const optionCount = difficulty === QuizDifficulty.EASY ? 2 : 
                     difficulty === QuizDifficulty.MEDIUM ? 4 : 6;
  
  // 过滤掉当前单词，选择干扰项
  const otherVocab = allVocab.filter(v => v.id !== vocab.id);
  const distractors = shuffleCards(otherVocab).slice(0, optionCount - 1);
  
  // 创建选项
  const choices = [
    { id: generateId(), content: vocab.word, isCorrect: true },
    ...distractors.map(v => ({ 
      id: generateId(), 
      content: v.word, 
      isCorrect: false 
    }))
  ];
  
  return {
    id: generateId(),
    type: QuizType.CHOICE,
    wordId: vocab.id,
    question: `请选择与以下释义相符的单词：${vocab.definition}`,
    answer: vocab.word,
    difficulty,
    prompt: vocab.definition,
    choices: shuffleCards(choices)
  };
};

/**
 * 生成拖拽题
 * @param vocab 目标单词
 * @param allVocab 所有单词列表
 * @param difficulty 难度级别
 * @returns 拖拽题对象
 */
export const generateDragDropQuestion = (
  vocab: Vocabulary, 
  allVocab: Vocabulary[],
  difficulty: QuizDifficulty = QuizDifficulty.MEDIUM
): DragDropQuestion => {
  // 根据难度确定拖拽项数量
  const wordCount = difficulty === QuizDifficulty.EASY ? 3 : 
                   difficulty === QuizDifficulty.MEDIUM ? 5 : 7;
  
  // 过滤掉当前单词，选择干扰项
  const otherVocab = allVocab.filter(v => v.id !== vocab.id);
  const distractors = shuffleCards(otherVocab).slice(0, wordCount - 1);
  
  // 所有单词(包括正确答案和干扰项)
  const allWords = shuffleCards([vocab, ...distractors]);
  
  const words = allWords.map(w => ({
    id: w.id,
    content: w.word
  }));
  
  const targets = allWords.map(w => ({
    id: `target-${w.id}`,
    definition: w.definition,
    answerId: w.id
  }));
  
  return {
    id: generateId(),
    type: QuizType.DRAG_DROP,
    wordId: vocab.id,
    question: '将单词拖放到对应的释义上',
    answer: vocab.word,
    difficulty,
    words,
    targets: shuffleCards(targets)
  };
};

/**
 * 根据学习状态和进度生成测验题目
 * @param vocabulary 词汇列表
 * @param cardProgress 卡片进度映射
 * @param count 题目数量
 * @param typeDistribution 题型分布
 * @returns 测验题目数组
 */
export const generateQuiz = (
  vocabulary: Vocabulary[],
  cardProgress: Record<string, { 
    status: LearningStatus, 
    correctCount: number, 
    incorrectCount: number 
  }> = {},
  count: number = 10,
  typeDistribution: QuizTypeDistribution = { 
    'type-in': 0.5, 
    'choice': 0.3, 
    'drag-drop': 0.2,
    'multi-choice': 0
  }
): QuizQuestion[] => {
  if (!vocabulary || vocabulary.length === 0) {
    return [];
  }
  
  // 确保词汇数量足够
  const actualCount = Math.min(count, vocabulary.length);
  
  // 排序词汇，优先选择：1.需要复习的 2.新的 3.已掌握的
  const vocabWithProgress = vocabulary.map(v => {
    const progress = cardProgress[v.id] || { 
      status: LearningStatus.NEW, 
      correctCount: 0, 
      incorrectCount: 0 
    };
    return { vocab: v, progress };
  });
  
  // 根据状态和错误率排序
  vocabWithProgress.sort((a, b) => {
    // 状态优先级：REVIEWING > NEW > LEARNING > MASTERED
    const statusPriority = {
      [LearningStatus.REVIEWING]: 0,
      [LearningStatus.NEW]: 1,
      [LearningStatus.LEARNING]: 2,
      [LearningStatus.MASTERED]: 3
    };
    
    if (statusPriority[a.progress.status] !== statusPriority[b.progress.status]) {
      return statusPriority[a.progress.status] - statusPriority[b.progress.status];
    }
    
    // 错误率高的优先
    const aErrorRate = a.progress.incorrectCount / (a.progress.correctCount + a.progress.incorrectCount || 1);
    const bErrorRate = b.progress.incorrectCount / (b.progress.correctCount + b.progress.incorrectCount || 1);
    
    return bErrorRate - aErrorRate;
  });
  
  // 选择要出题的词汇
  const selectedVocab = vocabWithProgress.slice(0, actualCount).map(v => v.vocab);
  
  // 计算每种题型的数量
  const typeInCount = Math.round(actualCount * typeDistribution['type-in']);
  const choiceCount = Math.round(actualCount * typeDistribution['choice']);
  const dragDropCount = actualCount - typeInCount - choiceCount;
  
  const quiz: QuizQuestion[] = [];
  
  // 生成填空题
  for (let i = 0; i < typeInCount && i < selectedVocab.length; i++) {
    const vocab = selectedVocab[i];
    const progress = cardProgress[vocab.id];
    
    // 根据学习进度确定难度
    let difficulty: QuizDifficulty;
    if (!progress || progress.status === LearningStatus.NEW || progress.correctCount === 0) {
      difficulty = QuizDifficulty.EASY;
    } else if (progress.incorrectCount > progress.correctCount / 2) {
      difficulty = QuizDifficulty.MEDIUM;
    } else {
      difficulty = QuizDifficulty.HARD;
    }
    
    quiz.push(generateTypeInQuestion(vocab, difficulty));
  }
  
  // 生成选择题
  for (let i = typeInCount; i < typeInCount + choiceCount && i < selectedVocab.length; i++) {
    const vocab = selectedVocab[i];
    const progress = cardProgress[vocab.id];
    
    // 根据学习进度确定难度
    let difficulty: QuizDifficulty;
    if (!progress || progress.status === LearningStatus.NEW || progress.correctCount < 2) {
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
    const progress = cardProgress[vocab.id];
    
    // 根据学习进度确定难度
    let difficulty: QuizDifficulty;
    if (!progress || progress.status === LearningStatus.NEW || progress.correctCount < 3) {
      difficulty = QuizDifficulty.EASY;
    } else if (progress.incorrectCount > 0) {
      difficulty = QuizDifficulty.MEDIUM;
    } else {
      difficulty = QuizDifficulty.HARD;
    }
    
    quiz.push(generateDragDropQuestion(vocab, vocabulary, difficulty));
  }
  
  return shuffleCards(quiz);
};