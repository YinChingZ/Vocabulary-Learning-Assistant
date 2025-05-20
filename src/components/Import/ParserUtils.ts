import { Vocabulary } from '../../types/vocabulary';

interface ParserStats {
  totalLines: number;
  validLines: number;
  invalidLines: number;
  warnings: string[];
}

/**
 * 验证输入文本格式是否有效
 * @param input 用户输入的文本
 */
export const validateInput = (input: string): { isValid: boolean; message: string } => {
  if (!input || !input.trim()) {
    return { isValid: false, message: '请输入词汇数据' };
  }

  const lines = input.trim().split('\n');
  // 检查同时支持短横线和长破折号
  const validLines = lines.filter(line => line.includes('-') || line.includes('—'));
  
  if (validLines.length === 0) {
    return { isValid: false, message: '未检测到有效格式的词汇（需包含破折号分隔符 - 或 —）' };
  }
  
  const validRatio = validLines.length / lines.length;
  
  if (validRatio < 0.7) {
    return { 
      isValid: false, 
      message: `仅检测到 ${validLines.length}/${lines.length} 行有效数据，请检查格式` 
    };
  }

  return { 
    isValid: true, 
    message: `检测到 ${validLines.length} 个有效词条` 
  };
};

/**
 * 从文本中提取词性信息
 * @param text 可能包含词性的文本
 */
const extractPartOfSpeech = (text: string): { partOfSpeech?: string; cleanText: string } => {
  // 支持的词性模式：括号内词性，开头词性+点
  const posPatterns = [
    /\(([nv]|adj|adv|prep|conj|pron|interj)\.\)/i,  // (n.) 格式
    /^([nv]|adj|adv|prep|conj|pron|interj)\.\s+/i,   // n. 开头格式
  ];

  for (const pattern of posPatterns) {
    const match = text.match(pattern);
    if (match) {
      // 提取词性并清理文本
      const partOfSpeech = match[1].toLowerCase();
      const cleanText = text.replace(match[0], '').trim();
      return { partOfSpeech, cleanText };
    }
  }
  
  // 没有检测到词性
  return { cleanText: text.trim() };
};

/**
 * 解析词汇数据文本
 * @param input 词汇数据文本
 */
export const parseInput = async (input: string): Promise<Vocabulary[]> => {
  const result: Vocabulary[] = [];
  const lines = input.trim().split('\n');
  const stats: ParserStats = {
    totalLines: lines.length,
    validLines: 0,
    invalidLines: 0,
    warnings: []
  };
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 跳过空行
    if (!trimmedLine) {
      stats.invalidLines++;
      continue;
    }
    
    // 使用正则表达式同时支持短横线和长破折号分隔
    const parts = trimmedLine.split(/[-—]/).map(part => part.trim());
    
    // 必须至少有单词和释义
    if (parts.length < 2) {
      stats.invalidLines++;
      continue;
    }
    
    const wordPart = parts[0];
    const definition = parts[1];
    const example = parts.length > 2 ? parts[2] : undefined;
    
    // 处理词性和单词
    const { partOfSpeech, cleanText: word } = extractPartOfSpeech(wordPart);
    
    // 创建词汇条目
    const vocabulary: Vocabulary = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      word,
      definition,
      ...(example && { example }),
      ...(partOfSpeech && { partOfSpeech }),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    result.push(vocabulary);
    stats.validLines++;
  }
  
  // 如果没有有效数据，抛出错误
  if (result.length === 0) {
    throw new Error('未能解析出任何有效的词汇条目');
  }
  
  return result;
};
