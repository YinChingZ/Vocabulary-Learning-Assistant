import React, { useState } from 'react';

const FormatHelper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  
  // 基本格式示例
  const basicExample = `abate - 减轻；减弱
acquiesce - 默许；勉强同意
alacrity - 敏捷；欣然`;

  // 高级格式示例，带词性和例句
  const advancedExample = `prodigious (adj.) - 巨大的，惊人的 - She has a prodigious appetite for learning.
ephemeral (adj.) - 短暂的，瞬息的 - Fame in the internet age is often ephemeral.
ameliorate (v.) - 改善，使...变好 - The new policies should ameliorate the economic situation.`;

  return (
    <div className="format-helper bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">词汇导入格式说明</h3>
      
      {/* 标签切换 */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`pb-2 px-4 ${activeTab === 'basic' 
            ? 'border-b-2 border-blue-500 font-medium text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          基础格式
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`pb-2 px-4 ${activeTab === 'advanced' 
            ? 'border-b-2 border-blue-500 font-medium text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          高级格式（带词性和例句）
        </button>
      </div>
      
      {/* 基础格式说明 */}
      {activeTab === 'basic' && (
        <div>
          <p className="mb-4">
            每行输入一个词条，使用<strong>破折号</strong>（- 或 —）分隔单词和释义：
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-6">
            <code className="text-sm">单词 - 释义</code>
            <br/>
            <code className="text-sm">或</code>
            <br/>
            <code className="text-sm">单词 — 释义</code>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">基本示例：</h4>
            <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm font-mono overflow-auto">
              {basicExample}
            </pre>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p><strong>提示：</strong> 系统同时支持短横线(-)、长破折号(—)和中横线(–)作为分隔符。基础格式适合快速导入大量词汇，只关注单词和释义。</p>
          </div>
        </div>
      )}
      
      {/* 高级格式说明 */}
      {activeTab === 'advanced' && (
        <div>
          <p className="mb-4">
            高级格式允许添加词性和例句，格式如下：
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4">
            <code className="text-sm">单词 (词性) - 释义 - 例句</code>
          </div>
          
          <p className="mb-3 text-sm">支持的词性表示：</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>n.</code> 名词</div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>v.</code> 动词</div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>adj.</code> 形容词</div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>adv.</code> 副词</div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>prep.</code> 介词</div>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded"><code>conj.</code> 连词</div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">高级示例：</h4>
            <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm font-mono overflow-auto">
              {advancedExample}
            </pre>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p><strong>提示：</strong> 词性可以添加在单词后面的括号中，也可以直接作为释义的一部分。系统会自动识别常见的词性标注。系统支持各种类型的破折号作为分隔符。</p>
          </div>
        </div>
      )}
      
      {/* 交互式示例 */}
      <div className="mt-8">
        <h4 className="font-medium mb-3">交互式格式化示例：</h4>
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded p-4">
          <div className="flex items-start mb-3">
            <div className="w-24 flex-shrink-0 text-gray-500">原始输入：</div>
            <div className="font-mono text-sm">ephemeral - 短暂的，瞬息的</div>
          </div>
          <div className="flex items-start mb-3">
            <div className="w-24 flex-shrink-0 text-gray-500">长破折号：</div>
            <div className="font-mono text-sm">ephemeral — 短暂的，瞬息的</div>
          </div>
          <div className="flex items-start mb-3">
            <div className="w-24 flex-shrink-0 text-gray-500">带词性：</div>
            <div className="font-mono text-sm">ephemeral (adj.) - 短暂的，瞬息的</div>
          </div>
          <div className="flex items-start">
            <div className="w-24 flex-shrink-0 text-gray-500">带例句：</div>
            <div className="font-mono text-sm">ephemeral (adj.) - 短暂的，瞬息的 - Fame is often ephemeral.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatHelper;
