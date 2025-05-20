import React from 'react';
import './styles/tailwind.css';
import './styles/animations.css';
import './App.css';

// 导入上下文提供者
import VocabularyContext from './context/VocabularyContext';
import { ProgressProvider } from './context/ProgressContext';
import SettingsContext, { Settings } from './context/SettingsContext';
import { useTheme } from './context/ThemeContext';

// 导入布局组件
import MainLayout from './components/common/Layout/MainLayout';

// 导入路由相关组件
import AppRoutes from './router';

// 导入自定义hooks
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './constants/storage-keys';

// 导入类型
import { Vocabulary } from './types/vocabulary';
import { Progress, WordProgress, LearningStatus } from './types/progress';

const App: React.FC = () => {
  // 使用本地存储管理词汇数据
  const [vocabulary, setVocabulary] = useLocalStorage<Vocabulary[]>(STORAGE_KEYS.VOCABULARY, []);
  
  // Progress 由 ProgressProvider 管理，本地存储在 Provider 内部处理
  
  // 使用本地存储管理用户设置 - 添加缺少的属性
  const [settings, setSettings] = useLocalStorage<Settings>(STORAGE_KEYS.SETTINGS, {
    theme: 'light',
    speechRate: 1,
    speechVoice: 'default',
    quizCount: 10,
    showExamples: true,
    // 添加缺少的必要属性
    fontSize: 'medium',
    autoPlayAudio: false,
    quizTypeDistribution: { 
      typeIn: 40,
      choice: 30,
      dragDrop: 30   
    },
    spacedRepetitionEnabled: true,
    reviewReminders: true
  });

  // 使用 ThemeContext 钩子获取主题切换和模式
  const { toggleTheme, isDarkMode } = useTheme();

  // 添加 VocabularyContext 需要的方法
  const addVocabulary = (word: Vocabulary) => {
    setVocabulary(prev => [...prev, word]);
  };

  const updateVocabulary = (id: string, updatedWordData: Partial<Vocabulary>) => {
    setVocabulary(prev => 
      prev.map(word => 
        word.id === id ? { ...word, ...updatedWordData } : word
      )
    );
  };

  const deleteVocabulary = (id: string) => {
    setVocabulary(prev => prev.filter(word => word.id !== id));
  };

  const getWordById = (id: string) => {
    return vocabulary.find(word => word.id === id);
  };

  // 添加缺失的方法
  const filterByPartOfSpeech = (partOfSpeech: string) => {
    return vocabulary.filter(word => word.partOfSpeech === partOfSpeech);
  };

  const markWord = (id: string, isMarked: boolean) => {
    setVocabulary(prev => prev.map(word => 
      word.id === id ? { ...word, isMarked } : word
    ));
  };

  const clearAllVocabulary = () => {
    setVocabulary([]);
  };

  // 更新 vocabularyContextValue 对象
  const vocabularyContextValue = {
    vocabulary,
    setVocabulary,
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
    getWordById,
    searchWords: (query: string) => vocabulary.filter(word => 
      word.word.toLowerCase().includes(query.toLowerCase()) || 
      word.definition.toLowerCase().includes(query.toLowerCase())
    ),
    getTotalWords: () => vocabulary.length,
    getRecentWords: (count: number) => [...vocabulary]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, count),
    // 添加缺失的方法
    filterByPartOfSpeech,
    markWord,
    clearAllVocabulary
  };

  // 添加必要的settings方法
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      speechRate: 1,
      speechVoice: 'default',
      quizCount: 10,
      showExamples: true,
      fontSize: 'medium',
      autoPlayAudio: false,
      quizTypeDistribution: { 
        typeIn: 40,
        choice: 30,
        dragDrop: 30
      },
      spacedRepetitionEnabled: true,
      reviewReminders: true
    });
  };

  // ProgressProvider 会提供 progressContext，内部更新和持久化

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      updateSetting, 
      resetSettings, 
      toggleTheme 
    }}>
      <VocabularyContext.Provider value={vocabularyContextValue}>
        <ProgressProvider>
          <MainLayout headerProps={{ onThemeToggle: toggleTheme, isDarkMode }}>
            <AppRoutes />
          </MainLayout>
        </ProgressProvider>
      </VocabularyContext.Provider>
    </SettingsContext.Provider>
  );
};

export default App;
