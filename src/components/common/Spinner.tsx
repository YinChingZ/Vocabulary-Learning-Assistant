import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'light' | 'dark';
  thickness?: 'thin' | 'regular' | 'thick';
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  thickness = 'regular',
  label,
}) => {
  // 大小映射
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // 颜色映射
  const colorMap = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    danger: 'text-red-500',
    light: 'text-white',
    dark: 'text-gray-800',
  };
  
  // 边框粗细映射
  const thicknessMap = {
    thin: 'border',
    regular: 'border-2',
    thick: 'border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeMap[size]} ${colorMap[color]} ${thicknessMap[thickness]} border-solid rounded-full border-r-transparent animate-spin`}
        role="status"
      />
      
      {label && (
        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
      
      <span className="sr-only">加载中...</span>
    </div>
  );
};

export default Spinner;