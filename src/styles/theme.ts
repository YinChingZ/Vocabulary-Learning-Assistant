/**
 * 主题变量定义
 * 基于README中的美术风格描述，定义了应用的全局设计变量
 */

export const theme = {
  // 颜色系统
  colors: {
    // 主色
    white: '#FFFFFF',            // 纯白背景
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',            // 辅助色：浅灰
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',            // 主色：深灰
      900: '#111827',
    },
    
    // 点缀色：明亮蓝
    blue: {
      50: '#EBF5FF',
      100: '#E1EFFE',
      200: '#C3DDFD',
      300: '#A4CAFE',
      400: '#76A9FA',
      500: '#3B82F6',            // 主要按钮、链接
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    
    // 辅助色：柔和黄
    yellow: {
      300: '#FCD34D',
      400: '#FBBF24',            // 标记、高亮
      500: '#F59E0B',
    },
    
    // 状态反馈色
    green: {
      400: '#34D399',
      500: '#10B981',            // 正确、成功
      600: '#059669',
    },
    red: {
      400: '#F87171',
      500: '#EF4444',            // 错误、警告
      600: '#DC2626',
    },
  },
  
  // 字体与排版
  typography: {
    // 字体族
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    // 字号
    fontSize: {
      // 移动端字号
      mobile: {
        body: '14px',
        title: {
          sm: '18px',
          md: '20px',
          lg: '24px',
        }
      },
      // 桌面端字号
      desktop: {
        body: '16px',
        title: {
          sm: '20px',
          md: '24px',
          lg: '32px',
        }
      }
    },
    // 行高
    lineHeight: 1.5,
    // 字距
    letterSpacing: '0.5px',
  },
  
  // 网格与间距
  spacing: {
    // 基础网格单位：8px
    unit: 8,
    
    // 常用间距
    small: 8,            // 1x
    medium: 16,          // 2x
    large: 24,           // 3x
    xlarge: 32,          // 4x
    
    // 容器内边距
    container: {
      small: 16,
      medium: 24,
    },
    
    // 模块间距
    section: {
      small: 24,
      medium: 32,
    }
  },
  
  // 阴影
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  // 圆角
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
  },
  
  // 过渡与动画
  transitions: {
    // 持续时间
    duration: {
      fast: '150ms',           // 输入框聚焦
      medium: '200ms',         // 按钮悬停
      slow: '300ms',           // 普通过渡
      cardFlip: '400ms',       // 卡片翻转
    },
    // 缓动函数
    easing: {
      default: 'ease-in-out',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // 响应式断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};

// 导出主题通用功能函数
export const getColor = (colorName: string, shade: number = 500) => {
  const colorKey = colorName as keyof typeof theme.colors;
  const col = theme.colors[colorKey];
  if (typeof col === 'object') {
    // 将 shade 转为字符串索引并断言颜色对象类型
    const shades = col as Record<string, string>;
    return shades[shade.toString()];
  }
  return col as string;
};

export default theme;