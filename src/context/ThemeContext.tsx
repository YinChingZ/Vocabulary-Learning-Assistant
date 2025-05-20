import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';

// 定义主题类型
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;                                // 当前主题模式
  currentTheme: 'light' | 'dark';                 // 实际应用的主题
  setTheme: (theme: ThemeMode) => void;           // 设置主题
  toggleTheme: () => void;                        // 切换主题
  isDarkMode: boolean;                            // 是否为暗色模式
}

// 创建上下文
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  currentTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDarkMode: false
});

// 上下文提供者组件
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light'
}) => {
  // 初始化主题设置
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // 检测系统主题偏好的钩子函数
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  // 初始加载主题
  useEffect(() => {
    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setCurrentTheme(getSystemTheme());
        applyThemeToDocument(getSystemTheme());
      }
    };
    
    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    
    // 清理监听器
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // 当主题变化时应用主题样式
  useEffect(() => {
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // 根据主题类型设置实际使用的主题
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      setCurrentTheme(systemTheme);
      applyThemeToDocument(systemTheme);
    } else {
      setCurrentTheme(theme);
      applyThemeToDocument(theme);
    }
  }, [theme]);
  
  // 将主题应用到文档
  const applyThemeToDocument = (theme: 'light' | 'dark') => {
    // 使用 'dark' 类切换暗色模式，Tailwind CSS darkMode 使用 'dark'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 设置meta标签颜色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1F2937' : '#FFFFFF'
      );
    }
  };
  
  // 设置主题
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };
  
  // 切换主题
  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'system') {
        // 如果当前是系统主题，切换到明确的模式
        return getSystemTheme() === 'light' ? 'dark' : 'light';
      } else {
        // 如果当前是明确的模式，在明/暗之间切换
        return prevTheme === 'light' ? 'dark' : 'light';
      }
    });
  };
  
  const contextValue: ThemeContextType = {
    theme,
    currentTheme,
    setTheme,
    toggleTheme,
    isDarkMode: currentTheme === 'dark'
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子用于消费主题上下文
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;