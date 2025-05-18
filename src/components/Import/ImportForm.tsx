import React, { ReactNode, useState } from 'react';
import { parseInput } from './ParserUtils';
import VocabularyContext from '../../context/VocabularyContext';
import Button from '../common/Button';
import { useContext } from 'react';
import BulkInputArea from './BulkInputArea';

interface ImportFormProps {
  onImportStart?: () => void;
  onImportSuccess?: (count: number) => void;
  onImportError?: (error: string) => void;
  children: ReactNode;
}

const ImportForm: React.FC<ImportFormProps> = ({ 
  children, 
  onImportStart,
  onImportSuccess, 
  onImportError 
}) => {
  const [bulkText, setBulkText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { setVocabulary } = useContext(VocabularyContext);
  
  // 处理输入文本变化
  const handleTextChange = (text: string) => {
    setBulkText(text);
  };
  
  // 处理导入提交
  const handleImport = async () => {
    if (!bulkText.trim()) {
      onImportError?.('请输入词汇数据');
      return;
    }

    try {
      setIsProcessing(true);
      onImportStart?.();
      
      // 使用解析工具处理输入文本
      const parsedData = await parseInput(bulkText);
      
      if (!parsedData || parsedData.length === 0) {
        onImportError?.('未能解析出有效词汇数据');
        return;
      }
      
      // 更新全局词汇数据
      setVocabulary(parsedData);
      onImportSuccess?.(parsedData.length);
      
    } catch (error) {
      console.error('导入失败:', error);
      onImportError?.('解析词汇数据时出现错误');
    } finally {
      setIsProcessing(false);
    }
  };

  // 克隆子组件并注入属性
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // 为BulkInputArea组件注入特定props，比较组件引用
      if (child.type === BulkInputArea) {
        return React.cloneElement(
          child as React.ReactElement<React.ComponentProps<typeof BulkInputArea>>,
          {
            value: bulkText,
            onChange: handleTextChange,
            disabled: isProcessing
          }
        );
      }
      return child;
    }
    return child;
  });
  
  return (
    <div className="import-form space-y-6">
      {childrenWithProps}
      
      <div className="flex justify-end space-x-4">
        <Button
          label={isProcessing ? "处理中..." : "导入词汇"}
          onClick={handleImport}
          disabled={isProcessing || !bulkText.trim()}
          className={`px-6 py-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
        />
      </div>
    </div>
  );
};

export default ImportForm;