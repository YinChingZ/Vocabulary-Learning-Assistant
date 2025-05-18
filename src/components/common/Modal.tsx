import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 按Esc关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape]);
  
  // 点击外部关闭
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // 根据尺寸设置宽度类
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={modalRef}
            className={`${sizeClasses[size]} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {(title || showCloseButton) && (
              <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                {title && (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    aria-label="关闭"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;