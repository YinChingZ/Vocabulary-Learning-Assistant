import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';

// 定义设置类型
export interface Settings {
  // 界面设置
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  
  // 学习偏好
  speechRate: number;         // 语音速度 0.5-2.0
  speechVoice: string;        // 语音偏好
  showExamples: boolean;      // 是否显示例句
  autoPlayAudio: boolean;     // 自动播放发音
  
  // 测验设置
  quizCount: number;          // 每次测验的题目数量
  quizTypeDistribution: {     // 测验类型分布
    typeIn: number;           // 填空题比例
    choice: number;           // 选择题比例
    dragDrop: number;         // 拖拽题比例
  };
  
  // 复习设置
  spacedRepetitionEnabled: boolean;  // 是否启用间隔重复
  reviewReminders: boolean;          // 是否开启复习提醒
}

// 定义上下文类型
interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
  toggleTheme: () => void;
}

// 创建默认设置
const defaultSettings: Settings = {
  // 界面设置
  theme: 'light',
  fontSize: 'medium',
  
  // 学习偏好
  speechRate: 1.0,
  speechVoice: 'default',
  showExamples: true,
  autoPlayAudio: true,
  
  // 测验设置
  quizCount: 10,
  quizTypeDistribution: {
    typeIn: 50,    // 50%
    choice: 30,    // 30%
    dragDrop: 20   // 20%
  },
  
  // 复习设置
  spacedRepetitionEnabled: true,
  reviewReminders: false
};

// 创建上下文
export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  updateSetting: () => {},
  resetSettings: () => {},
  toggleTheme: () => {}
});

// 上下文提供者组件
interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: Settings;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  initialSettings = defaultSettings
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // 从本地存储加载设置
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('加载设置数据失败:', error);
      }
    }
    
    // 如果设置为使用系统主题，设置响应系统首选项
    if (settings.theme === 'system') {
      applySystemTheme();
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    // 应用主题
    applyTheme(settings.theme);
  }, [settings]);

  // 更新单个设置
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 重置所有设置
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // 切换主题模式
  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  // 应用主题到document
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      applySystemTheme();
    } else {
      document.documentElement.classList.remove('light-theme', 'dark-theme');
      document.documentElement.classList.add(`${theme}-theme`);
    }
  };

  // 应用系统首选主题
  const applySystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (settings.theme === 'system') {
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(
          event.matches ? 'dark-theme' : 'light-theme'
        );
      }
    });
  };

  const contextValue: SettingsContextType = {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    toggleTheme
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;