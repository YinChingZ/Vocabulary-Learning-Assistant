import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 导入组件
import ImportForm from '../components/Import/ImportForm';
import BulkInputArea from '../components/Import/BulkInputArea';
import FormatHelper from '../components/Import/FormatHelper';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';

// 导入上下文和工具
import VocabularyContext from '../context/VocabularyContext';
import { parseInput } from '../components/Import/ParserUtils';
import { ROUTES } from '../constants/routes';
import { Vocabulary } from '../types/vocabulary';

const ImportPage: React.FC = () => {
  // 状态管理
  const [bulkText, setBulkText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [showHelperModal, setShowHelperModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedEntries, setParsedEntries] = useState<Vocabulary[]>([]);
  
  // 上下文和导航
  const { vocabulary, setVocabulary } = useContext(VocabularyContext);
  const navigate = useNavigate();

  // 检测如果已有词汇数据，展示提示
  useEffect(() => {
  if (vocabulary && vocabulary.length > 0) {
    setError('检测到已有词汇数据。继续操作将覆盖现有数据。');
  }
  // 仅在组件挂载时执行一次
}, []);

  // 处理批量文本输入变化
  const handleBulkTextChange = (text: string) => {
    setBulkText(text);
    setError(null);
  };

  // 处理导入提交
  const handleImport = async () => {
    if (!bulkText.trim()) {
      setError('请输入词汇数据');
      return;
    }

    try {
      setIsParsing(true);
      // 使用解析工具处理输入文本
      const parsedData = await parseInput(bulkText);
      
      if (!parsedData || parsedData.length === 0) {
        setError('未能解析出有效词汇数据');
        setIsParsing(false);
        return;
      }
      
      setParsedEntries(parsedData);
      setVocabulary(parsedData);
      setIsParsing(false);
      
      // 导入成功后延迟一小段时间再导航，让用户有时间看到成功消息
      setTimeout(() => {
        navigate(ROUTES.FLASHCARD);
      }, 1500);
    } catch (err) {
      console.error('导入失败:', err);
      setError('解析词汇数据时出现错误');
      setIsParsing(false);
    }
  };

  // 显示格式帮助
  const showFormatHelp = () => {
    setShowHelperModal(true);
  };

  return (
    <motion.div 
      className="import-page container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">导入词汇表</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        {/* 导入表单 */}
        <ImportForm>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              批量导入词汇
            </label>
            <BulkInputArea value={bulkText} onChange={handleBulkTextChange} />
            
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <span>每行一个词条，格式：词语 - 释义 - 例句(可选)</span>
              <button 
                onClick={showFormatHelp}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                查看格式说明
              </button>
            </div>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* 导入成功提示 */}
          {parsedEntries.length > 0 && !isParsing && !error && (
            <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 mb-6">
              <p>已成功导入 {parsedEntries.length} 个词汇，正在跳转到学习页面...</p>
            </div>
          )}
          
          {/* 按钮区域 */}
          <div className="flex justify-between">
            <Button
              label="格式示例"
              onClick={showFormatHelp}
              className="bg-gray-500 hover:bg-gray-600"
            />
            <Button
              label={isParsing ? "处理中..." : "导入词汇"}
              onClick={handleImport}
              disabled={isParsing || !bulkText.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </ImportForm>
      </div>
      
      {/* 加载状态 */}
      {isParsing && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-gray-700 dark:text-gray-300">正在处理词汇数据...</p>
          </div>
        </div>
      )}
      
      {/* 格式帮助模态框 */}
      <Modal isOpen={showHelperModal} onClose={() => setShowHelperModal(false)}>
        <div className="p-4">
          <h3 className="font-bold text-xl mb-4">词汇导入格式帮助</h3>
          <FormatHelper />
        </div>
      </Modal>
    </motion.div>
  );
};

export default ImportPage;