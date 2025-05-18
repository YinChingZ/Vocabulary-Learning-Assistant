import React, { useState, useEffect } from 'react';

interface BulkInputAreaProps {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minRows?: number;
}

const BulkInputArea: React.FC<BulkInputAreaProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = '请输入词汇列表，每行一个词条...',
  minRows = 10
}) => {
  const [validLines, setValidLines] = useState<number>(0);
  const [totalLines, setTotalLines] = useState<number>(0);
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  
  // 分析输入内容并提供简单预览
  useEffect(() => {
    if (!value.trim()) {
      setValidLines(0);
      setTotalLines(0);
      setPreviewLines([]);
      return;
    }
    
    const lines = value.trim().split('\n');
    setTotalLines(lines.length);
    
    // 检测有效行（至少包含一个破折号分隔符）
    const valid = lines.filter(line => line.includes('-'));
    setValidLines(valid.length);
    
    // 提取前3行作为预览
    setPreviewLines(lines.slice(0, 3));
    
  }, [value]);
  
  // 处理文本变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  // 处理粘贴事件，可选清理格式
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // 默认允许浏览器处理粘贴
    // 如果需要特殊处理，可以在这里添加代码
  };

  return (
    <div className="bulk-input-container">
      <textarea
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        disabled={disabled}
        placeholder={placeholder}
        rows={minRows}
        className={`w-full p-4 border rounded-lg font-mono text-sm
          transition duration-200 focus:ring focus:ring-blue-300 focus:border-blue-500 focus:outline-none
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${validLines > 0 ? 'border-green-300' : 'border-gray-300'}
        `}
        data-testid="bulk-input"
      />
      
      {/* 输入统计和预览 */}
      {totalLines > 0 && (
        <div className="mt-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              已检测到 <strong className={validLines > 0 ? 'text-green-600' : 'text-red-600'}>
                {validLines}/{totalLines}
              </strong> 行有效数据
            </span>
            <span>
              {validLines > 0 && `可导入 ${validLines} 个词条`}
            </span>
          </div>
          
          {/* 简单预览 */}
          {previewLines.length > 0 && validLines > 0 && (
            <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">预览:</div>
              {previewLines.map((line, index) => (
                <div key={index} className="text-xs font-mono truncate">
                  {line}
                </div>
              ))}
              {totalLines > 3 && <div className="text-xs text-gray-400 mt-1">...</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkInputArea;