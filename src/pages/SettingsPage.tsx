import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <motion.div
      className="settings-page container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">测验设置</h2>
        <div className="mb-4">
          <label htmlFor="quizCount" className="block mb-2 font-medium">
            每次测验题目数量
          </label>
          <input
            id="quizCount"
            type="number"
            min={1}
            max={50}
            value={settings.quizCount}
            onChange={e => updateSetting('quizCount', Number(e.target.value))}
            className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">题型分布 (%)</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-24">填空</span>
              <input
                type="number"
                min={0}
                max={100}
                value={settings.quizTypeDistribution.typeIn}
                onChange={e => updateSetting('quizTypeDistribution', {
                  ...settings.quizTypeDistribution,
                  typeIn: Number(e.target.value)
                })}
                className="w-16 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24">选择</span>
              <input
                type="number"
                min={0}
                max={100}
                value={settings.quizTypeDistribution.choice}
                onChange={e => updateSetting('quizTypeDistribution', {
                  ...settings.quizTypeDistribution,
                  choice: Number(e.target.value)
                })}
                className="w-16 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24">拖拽</span>
              <input
                type="number"
                min={0}
                max={100}
                value={settings.quizTypeDistribution.dragDrop}
                onChange={e => updateSetting('quizTypeDistribution', {
                  ...settings.quizTypeDistribution,
                  dragDrop: Number(e.target.value)
                })}
                className="w-16 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
