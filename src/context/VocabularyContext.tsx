import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { Vocabulary } from '../types/vocabulary';

// 定义上下文类型
interface VocabularyContextType {
  vocabulary: Vocabulary[];
  setVocabulary: React.Dispatch<React.SetStateAction<Vocabulary[]>>;
  addVocabulary: (newWord: Vocabulary) => void;
  updateVocabulary: (id: string, updatedWord: Partial<Vocabulary>) => void;
  deleteVocabulary: (id: string) => void;
  getWordById: (id: string) => Vocabulary | undefined;
  searchWords: (query: string) => Vocabulary[];
  filterByPartOfSpeech: (partOfSpeech: string) => Vocabulary[];
  markWord: (id: string, isMarked: boolean) => void;
  clearAllVocabulary: () => void;
}

// 创建上下文
export const VocabularyContext = createContext<VocabularyContextType>({
  vocabulary: [],
  setVocabulary: () => {},
  addVocabulary: () => {},
  updateVocabulary: () => {},
  deleteVocabulary: () => {},
  getWordById: () => undefined,
  searchWords: () => [],
  filterByPartOfSpeech: () => [],
  markWord: () => {},
  clearAllVocabulary: () => {}
});

// 上下文提供者组件
interface VocabularyProviderProps {
  children: ReactNode;
  initialVocabulary?: Vocabulary[];
}

export const VocabularyProvider: React.FC<VocabularyProviderProps> = ({ 
  children, 
  initialVocabulary = [] 
}) => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>(initialVocabulary);

  // 从本地存储加载词汇数据
  useEffect(() => {
    const storedVocabulary = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
    if (storedVocabulary) {
      try {
        const parsedData = JSON.parse(storedVocabulary);
        setVocabulary(parsedData);
      } catch (error) {
        console.error('加载词汇数据失败:', error);
      }
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(vocabulary));
  }, [vocabulary]);

  // 添加新词汇
  const addVocabulary = (newWord: Vocabulary) => {
    setVocabulary(prevVocabulary => [...prevVocabulary, newWord]);
  };

  // 更新现有词汇
  const updateVocabulary = (id: string, updatedWord: Partial<Vocabulary>) => {
    setVocabulary(prevVocabulary => 
      prevVocabulary.map(word => 
        word.id === id ? { ...word, ...updatedWord } : word
      )
    );
  };

  // 删除词汇
  const deleteVocabulary = (id: string) => {
    setVocabulary(prevVocabulary => 
      prevVocabulary.filter(word => word.id !== id)
    );
  };

  // 按ID获取词汇
  const getWordById = (id: string) => {
    return vocabulary.find(word => word.id === id);
  };

  // 搜索词汇
  const searchWords = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return vocabulary.filter(word => 
      word.word.toLowerCase().includes(lowerQuery) || 
      word.definition.toLowerCase().includes(lowerQuery)
    );
  };

  // 按词性过滤
  const filterByPartOfSpeech = (partOfSpeech: string) => {
    return vocabulary.filter(word => 
      word.partOfSpeech === partOfSpeech
    );
  };

  // 标记词汇
  const markWord = (id: string, isMarked: boolean) => {
    setVocabulary(prevVocabulary => 
      prevVocabulary.map(word => 
        word.id === id ? { ...word, isMarked } : word
      )
    );
  };

  // 清空所有词汇
  const clearAllVocabulary = () => {
    setVocabulary([]);
  };

  const contextValue: VocabularyContextType = {
    vocabulary,
    setVocabulary,
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
    getWordById,
    searchWords,
    filterByPartOfSpeech,
    markWord,
    clearAllVocabulary
  };

  return (
    <VocabularyContext.Provider value={contextValue}>
      {children}
    </VocabularyContext.Provider>
  );
};

export default VocabularyContext;