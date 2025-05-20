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
  // 检查同时支持各种破折号
  const validLines = lines.filter(line => 
    line.includes('-') || line.includes('—') || line.includes('–') || 
    line.includes('－') || line.includes('⸺') || line.includes('⸻') || line.includes('⹀')
  );
  
  if (validLines.length === 0) {
    return { isValid: false, message: '未检测到有效格式的词汇（需包含破折号分隔符如 - 或 — 等）' };
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
  
  console.log(`总行数: ${lines.length}`); // 调试日志
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 跳过空行
    if (!trimmedLine) {
      stats.invalidLines++;
      continue;
    }
    
    console.log(`处理行: ${trimmedLine}`); // 调试日志
    
    // 检测破折号类型（用于调试）
    const hasDash = trimmedLine.includes('-');
    const hasEmDash = trimmedLine.includes('—');
    const hasEnDash = trimmedLine.includes('–');
    console.log(`包含短横线: ${hasDash}, 包含长破折号: ${hasEmDash}, 包含中横线: ${hasEnDash}`); // 调试日志
    
    // 使用更广泛的正则表达式来匹配各种破折号
    // 包括短横线(-)、长破折号(—)、中横线(–)、全角中横线(－)等
    const parts = trimmedLine.split(/[-—–－⸺⸻⹀]/).map(part => part.trim());
    
    console.log(`分割后部分数量: ${parts.length}, 内容: ${JSON.stringify(parts)}`); // 调试日志
    
    // 必须至少有单词和释义
    if (parts.length < 2) {
      stats.invalidLines++;
      console.log(`无效行: 部分不足`); // 调试日志
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
    console.log(`成功添加词条: ${word}`); // 调试日志
  }
  
  console.log(`总共解析成功词条数量: ${result.length}`); // 调试日志
  
  // 如果没有有效数据，抛出错误
  if (result.length === 0) {
    throw new Error('未能解析出任何有效的词汇条目');
  }
  
  return result;
};
