// filepath: d:\Projects\satwordlist\vocabulary-app\src\components\Flashcard\CardBack.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardBackProps {
  definition: string;
  example?: string;
  mnemonics?: string;
  synonyms?: string[];
  partOfSpeech?: string;
}

const CardBack: React.FC<CardBackProps> = ({
  definition,
  example,
  mnemonics,
  synonyms,
  partOfSpeech
}) => {
  // 同义词显示状态
  const [showSynonyms, setShowSynonyms] = useState<boolean>(false);

  // 根据词性返回对应的图标
  const getPartOfSpeechIcon = (pos?: string): string => {
    if (!pos) return '';
    
    const posLower = pos.toLowerCase();
    if (posLower.includes('n')) return 'noun';
    if (posLower.includes('v')) return 'verb';
    if (posLower.includes('adj')) return 'adjective';
    if (posLower.includes('adv')) return 'adverb';
    if (posLower.includes('prep')) return 'preposition';
    if (posLower.includes('conj')) return 'conjunction';
    if (posLower.includes('pron')) return 'pronoun';
    if (posLower.includes('interj')) return 'interjection';
    
    return '';
  };

  // 词性图标组件
  const PartOfSpeechIcon: React.FC<{ type: string }> = ({ type }) => {
    // 这里使用简化的图标实现，实际项目中可以使用更丰富的图标库
    const getIconPath = () => {
      switch (type) {
        case 'noun':
          return (
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          );
        case 'verb':
          return (
            <path d="M8 5v14l11-7z" />
          );
        case 'adjective':
          return (
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          );
        case 'adverb':
          return (
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
          );
        default:
          return (
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          );
      }
    };

    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="inline-block mr-1"
      >
        {getIconPath()}
      </svg>
    );
  };

  // 切换同义词显示状态
  const toggleSynonyms = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSynonyms(!showSynonyms);
  };

  return (
    <div className="card-back bg-white dark:bg-gray-800 p-6 rounded-xl">
      <div className="space-y-4">
        {/* 词性和释义 */}
        <div className="definition">
          {partOfSpeech && (
            <div className="flex items-center mb-1 text-sm text-gray-500 dark:text-gray-400">
              <PartOfSpeechIcon type={getPartOfSpeechIcon(partOfSpeech)} />
              <span>{partOfSpeech}</span>
            </div>
          )}
          
          <h3 className="font-semibold text-xl mb-2">释义</h3>
          <p className="text-gray-700 dark:text-gray-300">{definition}</p>
        </div>
        
        {/* 例句 */}
        {example && (
          <div className="example">
            <h3 className="font-semibold text-lg mb-1">例句</h3>
            <p className="text-gray-600 dark:text-gray-400 italic border-l-4 border-gray-200 dark:border-gray-700 pl-3 py-1">
              {example}
            </p>
          </div>
        )}
        
        {/* 助记短语 */}
        {mnemonics && (
          <div className="mnemonics">
            <h3 className="font-semibold text-lg mb-1">助记</h3>
            <p className="text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
              {mnemonics}
            </p>
          </div>
        )}
        
        {/* 同义词 */}
        {synonyms && synonyms.length > 0 && (
          <div className="synonyms">
            <button
              className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
              onClick={toggleSynonyms}
            >
              {showSynonyms ? '收起同义词' : '查看同义词'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-1 transition-transform ${showSynonyms ? 'rotate-180' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            
            {showSynonyms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <div className="flex flex-wrap gap-2">
                  {synonyms.map((synonym, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBack;