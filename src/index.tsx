import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/animations.css';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';

/**
 * 检查LocalStorage可用性
 * 返回true表示可用，false表示不可用
 */
const checkLocalStorageAvailability = (): boolean => {
  const testKey = '__storage_test__';
  try {
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('LocalStorage不可用，应用功能可能受限。错误:', e);
    return false;
  }
};

/**
 * 初始化应用服务
 * 在应用启动时执行必要的初始化工作
 */
const initializeAppServices = (): void => {
  // 检查本地存储可用性
  const isLocalStorageAvailable = checkLocalStorageAvailability();
  
  // 设置日志级别
  if (process.env.NODE_ENV === 'production') {
    console.log('应用运行在生产模式');
  } else {
    console.log('应用运行在开发模式');
    console.log('本地存储状态:', isLocalStorageAvailable ? '可用' : '不可用');
  }

  // 其他初始化逻辑可以在这里添加
  // 例如: 初始化分析工具、日志服务等
};

// 执行应用初始化
initializeAppServices();

// 创建React根节点并渲染应用
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 渲染应用，使用严格模式以便在开发中捕获潜在问题
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

// 如果需要测量性能，可以将函数传递给reportWebVitals
// 例如: reportWebVitals(console.log)
// 或发送到分析端点，了解更多: https://bit.ly/CRA-vitals
reportWebVitals();