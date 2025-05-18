import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outline' | 'filled' | 'underlined';
  fullWidth?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  variant = 'outline',
  fullWidth = false,
  className = '',
  id,
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  // 基础样式
  const baseClasses = 'transition-colors duration-150 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-600';
  
  // 容器样式
  const containerClasses = fullWidth ? 'w-full' : '';
  
  // 输入框样式
  const inputVariants = {
    outline: `border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-200 dark:focus:ring-blue-900'} rounded-md`,
    filled: `bg-gray-100 dark:bg-gray-700 border-transparent ${error ? 'focus:border-red-500 focus:ring-red-200' : 'focus:border-blue-500 focus:ring-blue-200'} rounded-md`,
    underlined: `border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'}`
  };
  
  // 带图标时添加padding
  const iconPaddingClasses = {
    start: startIcon ? 'pl-10' : '',
    end: endIcon ? 'pr-10' : '',
  };

  return (
    <div className={`${containerClasses}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            ${baseClasses}
            ${inputVariants[variant]}
            ${iconPaddingClasses.start}
            ${iconPaddingClasses.end}
            p-2 w-full focus:outline-none focus:ring-2
            ${className}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          onChange={onChange}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;