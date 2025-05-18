import { Vocabulary } from '../types/vocabulary';
import { CardProgress, LearningStatus } from '../hooks/useCardProgress';

/**
 * 打乱卡片顺序
 * @param cards 要打乱的卡片数组
 * @returns 打乱后的新数组
 */
export const shuffleCards = <T>(cards: T[]): T[] => {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * 根据学习状态过滤卡片
 * @param cards 卡片数组
 * @param progressMap 卡片进度映射
 * @param status 学习状态
 * @returns 过滤后的卡片数组
 */
export const filterCardsByStatus = (
  cards: Vocabulary[], 
  progressMap: Record<string, CardProgress>,
  status: LearningStatus
): Vocabulary[] => {
  return cards.filter(card => 
    progressMap[card.id] && progressMap[card.id].status === status
  );
};

/**
 * 根据复习优先级排序卡片
 * @param cards 卡片数组
 * @param progressMap 卡片进度映射
 * @returns 排序后的卡片数组
 */
export const sortCardsByPriority = (
  cards: Vocabulary[], 
  progressMap: Record<string, CardProgress>
): Vocabulary[] => {
  return [...cards].sort((a, b) => {
    const progressA = progressMap[a.id] || { status: LearningStatus.NEW, incorrectCount: 0, correctCount: 0 };
    const progressB = progressMap[b.id] || { status: LearningStatus.NEW, incorrectCount: 0, correctCount: 0 };
    
    // 状态优先级：REVIEWING > NEW > LEARNING > MASTERED
    const statusPriority = {
      [LearningStatus.REVIEWING]: 0,
      [LearningStatus.NEW]: 1,
      [LearningStatus.LEARNING]: 2,
      [LearningStatus.MASTERED]: 3
    };
    
    if (statusPriority[progressA.status] !== statusPriority[progressB.status]) {
      return statusPriority[progressA.status] - statusPriority[progressB.status];
    }
    
    // 错误率高的优先
    const errorRateA = progressA.incorrectCount / (progressA.correctCount + progressA.incorrectCount || 1);
    const errorRateB = progressB.incorrectCount / (progressB.correctCount + progressB.incorrectCount || 1);
    
    return errorRateB - errorRateA;
  });
};

/**
 * 将词汇按词性分组
 * @param vocabulary 词汇数组
 * @returns 按词性分组的词汇对象
 */
export const groupByPartOfSpeech = (vocabulary: Vocabulary[]): Record<string, Vocabulary[]> => {
  return vocabulary.reduce((groups, word) => {
    const partOfSpeech = word.partOfSpeech || '其他';
    if (!groups[partOfSpeech]) {
      groups[partOfSpeech] = [];
    }
    groups[partOfSpeech].push(word);
    return groups;
  }, {} as Record<string, Vocabulary[]>);
};

/**
 * 从词汇列表中提取唯一词性列表
 * @param vocabulary 词汇数组
 * @returns 唯一词性数组
 */
export const extractUniquePartOfSpeech = (vocabulary: Vocabulary[]): string[] => {
  const partsOfSpeech = vocabulary
    .map(word => word.partOfSpeech)
    .filter((part): part is string => !!part);
    
  // 使用 Array.from 获取 Set 唯一值数组，避免使用 downlevelIteration
  return Array.from(new Set(partsOfSpeech));
};

/**
 * 转换词汇为简单数据结构(用于导出)
 * @param vocabulary 词汇数组
 * @returns 简化的词汇对象数组
 */
export const convertToSimpleFormat = (vocabulary: Vocabulary[]): Record<string, string>[] => {
  return vocabulary.map(word => ({
    word: word.word,
    definition: word.definition,
    ...(word.partOfSpeech && { partOfSpeech: word.partOfSpeech }),
    ...(word.example && { example: word.example }),
  }));
};