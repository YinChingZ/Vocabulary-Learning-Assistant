import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playSpeech } from '../Flashcard/SpeechPlayer';

interface RevisionListProps {
  words: string[];
}

const RevisionList: React.FC<RevisionListProps> = ({ words }) => {
  const [revisionWords, setRevisionWords] = useState<{word: string; isMarked: boolean}[]>(
    words.map(word => ({ word, isMarked: false }))
  );
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'marked' | 'default'>('default');
  
  // 标记/取消标记单词
  const toggleMark = (index: number) => {
    const newWords = [...revisionWords];
    newWords[index].isMarked = !newWords[index].isMarked;
    setRevisionWords(newWords);
  };
  
  // 根据当前排序方法对单词进行排序
  const sortedWords = React.useMemo(() => {
    if (sortMethod === 'default') {
      return [...revisionWords];
    }
    
    return [...revisionWords].sort((a, b) => {
      if (sortMethod === 'alphabetical') {
        return a.word.localeCompare(b.word);
      }
      
      if (sortMethod === 'marked') {
        return a.isMarked === b.isMarked ? 0 : a.isMarked ? -1 : 1;
      }
      
      return 0;
    });
  }, [revisionWords, sortMethod]);
  
  // 播放单词发音
  const handlePlaySpeech = (word: string) => {
    playSpeech(word);
  };
  
  return (
    <div className="revision-list">
      {/* 排序控制 */}
      <div className="flex justify-end mb-3">
        <select 
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value as 'alphabetical' | 'marked' | 'default')}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          <option value="default">默认排序</option>
          <option value="alphabetical">字母排序</option>
          <option value="marked">标记优先</option>
        </select>
      </div>
      
      {/* 单词列表 */}
      <ul className="space-y-2">
        {sortedWords.map((item, index) => (
          <motion.li 
            key={index}
            className={`
              flex justify-between items-center p-3 rounded-md
              ${item.isMarked 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500' 
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}
            `}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-medium">{item.word}</span>
            <div className="flex space-x-2">
              {/* 标记按钮 */}
              <button
                onClick={() => toggleMark(index)}
                className={`p-1.5 rounded-full ${
                  item.isMarked 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={item.isMarked ? "取消标记" : "标记单词"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              
              {/* 发音按钮 */}
              <button
                onClick={() => handlePlaySpeech(item.word)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="播放发音"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      
      {/* 空状态显示 */}
      {words.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          没有需要复习的单词
        </div>
      )}
    </div>
  );
};

export default RevisionList;