import { Vocabulary } from '../types/vocabulary';

/**
 * 验证邮箱格式
 * @param email 电子邮箱
 * @returns 验证结果
 */
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email) return { isValid: false, message: '请输入邮箱地址' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '邮箱格式不正确' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证密码强度
 * @param password 密码
 * @returns 验证结果和强度等级
 */
export const validatePassword = (password: string): { 
  isValid: boolean; 
  message: string; 
  strength: 'weak' | 'medium' | 'strong' 
} => {
  if (!password) {
    return { isValid: false, message: '请输入密码', strength: 'weak' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: '密码长度不能少于8位', strength: 'weak' };
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  // 检查密码强度
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (hasLetter && hasDigit && hasSymbol) {
    strength = 'strong';
  } else if ((hasLetter && hasDigit) || (hasLetter && hasSymbol) || (hasDigit && hasSymbol)) {
    strength = 'medium';
  }
  
  return { 
    isValid: true, 
    message: strength === 'weak' ? '密码强度较弱' : 
             strength === 'medium' ? '密码强度中等' : '密码强度高',
    strength 
  };
};

/**
 * 验证输入文本是否包含有效的词汇数据
 * @param input 用户输入的文本
 * @returns 验证结果
 */
export const validateVocabularyInput = (input: string): { 
  isValid: boolean; 
  message: string;
  validCount?: number;
} => {
  if (!input || !input.trim()) {
    return { isValid: false, message: '请输入词汇数据' };
  }

  const lines = input.trim().split('\n');
  const validLines = lines.filter(line => line.includes('-'));
  
  if (validLines.length === 0) {
    return { 
      isValid: false, 
      message: '未检测到有效格式的词汇（需包含破折号分隔符）' 
    };
  }
  
  const validRatio = validLines.length / lines.length;
  
  if (validRatio < 0.7) {
    return { 
      isValid: false, 
      message: `格式有误，只有${validLines.length}/${lines.length}行符合"单词 - 释义"格式`, 
      validCount: validLines.length 
    };
  }
  
  return { 
    isValid: true, 
    message: `检测到${validLines.length}个有效词条`, 
    validCount: validLines.length 
  };
};

/**
 * 提取单词中的词性
 * @param word 单词文本
 * @returns 词性和清理后的单词
 */
export const extractPartOfSpeech = (word: string): { partOfSpeech: string | null; cleanText: string } => {
  // 匹配 "word (n.)" 或 "word（adj.）" 格式
  const regex = /^(.*?)[\s]*[\(（]([a-z\. ]+)[\)）][\s]*$/;
  const match = word.match(regex);
  
  if (match) {
    return {
      cleanText: match[1].trim(),
      partOfSpeech: normalizePOS(match[2].trim())
    };
  }
  
  return { cleanText: word.trim(), partOfSpeech: null };
};

/**
 * 标准化词性缩写
 * @param pos 词性文本
 * @returns 标准化的词性
 */
export const normalizePOS = (pos: string): string => {
  const posMap: Record<string, string> = {
    'n': '名词',
    'n.': '名词',
    'noun': '名词',
    'v': '动词',
    'v.': '动词',
    'verb': '动词',
    'adj': '形容词',
    'adj.': '形容词',
    'adjective': '形容词',
    'adv': '副词',
    'adv.': '副词',
    'adverb': '副词',
    'prep': '介词',
    'prep.': '介词',
    'preposition': '介词',
    'conj': '连词',
    'conj.': '连词',
    'conjunction': '连词',
    'pron': '代词',
    'pron.': '代词',
    'pronoun': '代词',
    'interj': '感叹词',
    'interj.': '感叹词',
    'interjection': '感叹词'
  };
  
  return posMap[pos.toLowerCase()] || pos;
};

/**
 * 验证完整的词汇对象
 * @param vocabulary 词汇对象
 * @returns 验证结果和错误信息
 */
export const validateVocabularyObject = (vocabulary: Partial<Vocabulary>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  if (!vocabulary.word) {
    errors.word = '单词不能为空';
  }
  
  if (!vocabulary.definition) {
    errors.definition = '释义不能为空';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 验证批量导入的词汇数据
 * @param vocabularyList 词汇对象数组
 * @returns 验证结果和错误信息
 */
export const validateBulkImport = (vocabularyList: Partial<Vocabulary>[]): {
  isValid: boolean;
  errorCount: number;
  invalidItems: { index: number; errors: Record<string, string> }[];
} => {
  const invalidItems: { index: number; errors: Record<string, string> }[] = [];
  
  vocabularyList.forEach((item, index) => {
    const { isValid, errors } = validateVocabularyObject(item);
    if (!isValid) {
      invalidItems.push({ index, errors });
    }
  });
  
  return {
    isValid: invalidItems.length === 0,
    errorCount: invalidItems.length,
    invalidItems
  };
};