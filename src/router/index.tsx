import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// 导入页面组件
import ImportPage from '../pages/ImportPage';
import FlashcardPage from '../pages/FlashcardPage';
import QuizPage from '../pages/QuizPage';
import SummaryPage from '../pages/SummaryPage';
import NotFoundPage from '../pages/NotFoundPage';
import SettingsPage from '../pages/SettingsPage';

// 导入上下文和常量
import { VocabularyContext } from '../context/VocabularyContext';
import { ROUTES } from '../constants/routes';

// 需要词汇数据的路由路径
const ROUTES_REQUIRING_VOCABULARY = [
  ROUTES.FLASHCARD,
  ROUTES.QUIZ
];

// 路由守卫组件 - 检查词汇数据是否存在
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const VocabularyProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { vocabulary } = useContext(VocabularyContext);
  const location = useLocation();
  
  // 如果当前路径需要词汇数据但词汇数据为空，重定向到导入页面
  if (
    ROUTES_REQUIRING_VOCABULARY.includes(location.pathname as any) && 
    (!vocabulary || vocabulary.length === 0)
  ) {
    return <Navigate to={ROUTES.IMPORT} replace />;
  }

  return <>{children}</>;
};

// 主路由组件
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 默认路由重定向到导入页 */}
      <Route path="/" element={<Navigate to={ROUTES.IMPORT} replace />} />
      
      {/* 主要应用路由 */}
      <Route path={ROUTES.IMPORT} element={<ImportPage />} />
      
      {/* 需要词汇数据的路由 */}
      <Route path={ROUTES.FLASHCARD} element={
        <VocabularyProtectedRoute>
          <FlashcardPage />
        </VocabularyProtectedRoute>
      } />
      
      <Route path={ROUTES.QUIZ} element={
        <VocabularyProtectedRoute>
          <QuizPage />
        </VocabularyProtectedRoute>
      } />
      
      <Route path={ROUTES.SUMMARY} element={<SummaryPage />} />
      
      {/* 设置页面 */}
      <Route path="/settings" element={<SettingsPage />} />
      
      {/* 404 页面 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;