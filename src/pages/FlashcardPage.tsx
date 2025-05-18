import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 导入组件
import Card from '../components/Flashcard/Card';
import CardControls from '../components/Flashcard/CardControls';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

// 导入上下文、hook和工具
import VocabularyContext from '../context/VocabularyContext';
import ProgressContext from '../context/ProgressContext';
import SettingsContext from '../context/SettingsContext';
import { shuffleCards } from '../utils/cardUtils';
import { playSpeech } from '../components/Flashcard/SpeechPlayer';
import { ROUTES } from '../constants/routes';
import { Vocabulary } from '../types/vocabulary';

const FlashcardPage: React.FC = () => {
  // 状态管理
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [remembered, setRemembered] = useState<Set<number>>(new Set());
  const [needRevision, setNeedRevision] = useState<Set<number>>(new Set());
  const [cards, setCards] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 上下文
  const { vocabulary } = useContext(VocabularyContext);
  const { progress, setProgress, updateWordProgress } = useContext(ProgressContext);
  const { settings } = useContext(SettingsContext);
  const navigate = useNavigate();

  // 初始化卡片数据
  useEffect(() => {
    if (vocabulary && vocabulary.length > 0) {
      // 仅当 cards 为空时初始化，防止重复更新
      if (cards.length === 0) {
        const shuffledCards = shuffleCards([...vocabulary]);
        setCards(shuffledCards);
        setIsLoading(false);
      }
    } else {
      // 如果没有词汇数据，重定向到导入页面
      navigate(ROUTES.IMPORT);
    }
  }, [vocabulary, navigate, cards.length]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      switch (e.key) {
        case ' ': // 空格键
        case 'Enter':
          setFlipped(!flipped);
          break;
        case 'ArrowRight': // 右箭头
          if (flipped) handleRemembered();
          break;
        case 'ArrowLeft': // 左箭头
          if (flipped) handleRevision();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipped, isLoading]);

  // 翻转卡片
  const flipCard = () => {
    if (isLoading) return;
    
    // 切换卡片翻转状态
    setFlipped(!flipped);
    
    // 如果翻到正面，播放单词发音
    if (!flipped && cards[currentIndex]) {
      // 延迟播放，等待翻转动画完成
      setTimeout(() => {
        playSpeech(cards[currentIndex].word);
      }, 400);
    }
  };
  // 处理记住了
  const handleRemembered = useCallback(() => {
    if (isLoading) return;
    // 更新单卡进度和总体进度
    const vocab = cards[currentIndex];
    updateWordProgress(vocab.id, true);
    setProgress(prev => ({ ...prev, total: prev.total + 1, completed: prev.completed + 1 }));
    setRemembered(prev => new Set(prev).add(currentIndex));
    // 切换回正面
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      // 下一张卡
      setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
    } else {
      // 所有卡片学习完毕，跳转总结页面
      navigate(ROUTES.SUMMARY);
    }
  }, [currentIndex, cards.length, navigate]);
 
  // 处理需要复习
  const handleRevision = useCallback(() => {
    if (isLoading) return;
    // 更新单卡进度和总体进度
    const vocab = cards[currentIndex];
    updateWordProgress(vocab.id, false);
    setProgress(prev => ({ ...prev, total: prev.total + 1 }));
    setNeedRevision(prev => new Set(prev).add(currentIndex));
    // 切换回正面
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
    } else {
      navigate(ROUTES.SUMMARY);
    }
  }, [currentIndex, cards.length, navigate]);

  // 跳转到测验页面
  const goToQuiz = () => {
    navigate(ROUTES.QUIZ);
  };

  // 查看学习总结
  const goToSummary = () => {
    navigate(ROUTES.SUMMARY);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Spinner />
        <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flashcard-page container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <>
        {/* 学习进度 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">闪卡学习</h2>
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              进度: {currentIndex + 1} / {cards.length}
            </span>
            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* 闪卡容器 */}
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`card-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "tween" }}
              className="w-full max-w-md"
            >
              {cards[currentIndex] && (
                <Card
                  vocabulary={cards[currentIndex]}
                  isFlipped={flipped}
                  onFlip={flipCard}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* 卡片控制按钮 */}
        <div className="mt-8 flex justify-center">
          <CardControls 
            isFlipped={flipped}
            onFlip={flipCard}
            onRemembered={handleRemembered}
            onRevision={handleRevision}
          />
        </div>
        
        {/* 学习提示 */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          提示: 空格键翻转卡片，左右方向键标记结果
        </div>
      </>
    </motion.div>
  );
};

export default FlashcardPage;