// filepath: d:\Projects\satwordlist\vocabulary-app\src\components\Flashcard\CardAnimation.ts
import { Variants } from 'framer-motion';

// 卡片翻转动画变体
export const cardVariants: Variants = {
  // 卡片初始状态
  hidden: { 
    opacity: 0.6, 
    scale: 0.8, 
    rotateY: 0 
  },
  
  // 卡片可见状态
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  
  // 卡片退出状态（用于组件卸载动画）
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
  
  // 卡片翻转到背面
  flipped: {
    rotateY: 180,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

// 卡片滑出动画（应对答正确时）
export const cardCorrectVariants: Variants = {
  animate: {
    x: [0, 20, -1000],
    opacity: [1, 1, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 1]
    }
  }
};

// 卡片滑出动画（答错时）
export const cardIncorrectVariants: Variants = {
  animate: {
    x: [0, -20, 1000],
    opacity: [1, 1, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 1]
    }
  }
};

// 卡片进入动画
export const cardEnterVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// 卡片内容淡入淡出动画
export const contentFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      delay: 0.2,
      duration: 0.3 
    }
  }
};

// 按钮动画
export const buttonVariants: Variants = {
  idle: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// 提供3D效果的CSS样式
export const perspective3dStyle = {
  perspective: "1000px",
  transformStyle: "preserve-3d"
};

// 隐藏卡片背面的CSS样式
export const backfaceHiddenStyle = {
  backfaceVisibility: "hidden" as "hidden"
};