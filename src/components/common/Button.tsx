import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  // 设置基础样式
  const baseClasses = 'rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 设置尺寸相关样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-2.5 text-lg'
  };
  
  // 设置类型相关样式
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-300'
  };
  
  // 禁用状态样式
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  // 全宽样式
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // 悬停时阴影效果
  const hoverShadowClasses = !disabled ? 'hover:shadow-md' : '';
  
  return (
    <button
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? disabledClasses : ''}
        ${widthClasses}
        ${hoverShadowClasses}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center">
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
            <span>加载中...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            {label}
            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
          </>
        )}
      </div>
    </button>
  );
};

export default Button;