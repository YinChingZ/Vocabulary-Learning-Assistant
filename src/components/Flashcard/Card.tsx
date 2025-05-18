import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardFront from './CardFront';
import CardBack from './CardBack';
import { cardVariants } from './CardAnimation';
import { playSpeech } from './SpeechPlayer';
import { Vocabulary } from '../../types/vocabulary';

interface CardProps {
  vocabulary: Vocabulary;
  isFlipped: boolean;
  onFlip: () => void;
}

const Card: React.FC<CardProps> = ({ vocabulary, isFlipped, onFlip }) => {
  // 跟踪触摸位置用于滑动检测
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  // 配置滑动检测的阈值
  const minSwipeDistance = 50;

  // 处理滑动手势
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (!isFlipped) {
        // 如果卡片未翻转，任何方向的滑动都会触发翻转
        onFlip();
      }
    }
    
    // 重置触摸状态
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 处理发音播放
  const handleSpeech = () => {
    playSpeech(vocabulary.word);
  };

  // 设置deviceorientation事件来检测摇晃手势
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;
    
    const shakeThreshold = 15;
    const timeThreshold = 100;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if ((now - lastTime) < timeThreshold) return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration || !acceleration.x || !acceleration.y || !acceleration.z) return;
      
      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(acceleration.x - lastX);
        const deltaY = Math.abs(acceleration.y - lastY);
        const deltaZ = Math.abs(acceleration.z - lastZ);
        
        if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
            (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
            (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
          if (isFlipped) {
            // 如果卡片已翻转，摇一摇可以触发"记住了"或"再看一次"
            // 这里默认是"记住了"，实际中可以根据需求调整
            console.log('卡片被摇动: 标记为"记住了"');
            // 这里可以添加回调函数，例如: onRemembered();
          }
        }
      }
      
      lastX = acceleration.x;
      lastY = acceleration.y;
      lastZ = acceleration.z;
      lastTime = now;
    };
    
    // 仅在支持的设备上添加事件监听
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [isFlipped]);

  return (
    <div 
      className="flashcard-container perspective-1000 w-full cursor-pointer"
      onClick={onFlip}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className={`flashcard relative w-full h-full transition-shadow hover:shadow-lg rounded-xl ${
          isFlipped ? 'shadow-md' : 'shadow-sm'
        }`}
        initial="visible"
        animate={isFlipped ? "flipped" : "visible"}
        variants={{
          visible: { rotateY: 0 },
          flipped: { rotateY: 180 }
        }}
        transition={{ 
          type: "tween", 
          duration: 0.4, 
          ease: "easeInOut",
          // 添加一个较长的延迟，确保动画完全完成
          delay: 0.1
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 卡片正面 */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardFront 
            word={vocabulary.word} 
            partOfSpeech={vocabulary.partOfSpeech} 
            onSpeechPlay={handleSpeech} 
          />
        </div>
        
        {/* 卡片背面 */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardBack 
            definition={vocabulary.definition}
            example={vocabulary.example}
            mnemonics={vocabulary.mnemonics}
            synonyms={vocabulary.synonyms}
            partOfSpeech={vocabulary.partOfSpeech}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Card;