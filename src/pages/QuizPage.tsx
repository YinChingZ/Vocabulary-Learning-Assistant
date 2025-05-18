import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 导入组件
import TypeInQuiz from '../components/Quiz/TypeInQuiz';
import ChoiceQuiz from '../components/Quiz/ChoiceQuiz';
import DragDropQuiz from '../components/Quiz/DragDropQuiz';
import QuizProgress from '../components/Quiz/QuizProgress';
import FeedbackMessage from '../components/Quiz/FeedbackMessage';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// 导入上下文、hook和工具
import VocabularyContext from '../context/VocabularyContext';
import ProgressContext from '../context/ProgressContext';
import SettingsContext from '../context/SettingsContext';
import { generateQuiz } from '../utils/quizAlgorithm';
import { ROUTES } from '../constants/routes';
import { QUIZ_SETTINGS } from '../constants/quiz-settings';
import { QuizQuestion } from '../types/quiz';
import { playSpeech } from '../components/Flashcard/SpeechPlayer';

// 定义测验类型
type QuizType = 'type-in' | 'choice' | 'drag-drop';

const QuizPage: React.FC = () => {
  // 状态管理
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; isCorrect: boolean }>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string; userAnswer?: string }>({ 
    isCorrect: false, 
    correctAnswer: '',
    userAnswer: ''
  });
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizTypes, setQuizTypes] = useState<QuizType[]>([]);

  // 上下文
  const { vocabulary } = useContext(VocabularyContext);
  const { progress, setProgress } = useContext(ProgressContext);
  const { settings } = useContext(SettingsContext);
  const navigate = useNavigate();

  // 初始化测验
  useEffect(() => {
    // 只在首次初始化或重新加载测验时执行
    if (!isLoading) return;
    if (vocabulary && vocabulary.length > 0) {
      // 根据生成的问题数组设置测验类型序列，保持顺序一致
      const generatedQuestions = generateQuiz(vocabulary);
      const questionsToUse = generatedQuestions.slice(
        0,
        Math.min(QUIZ_SETTINGS.QUESTION_COUNT, generatedQuestions.length)
      );
      const types = questionsToUse.map(q => q.type as QuizType);
      setQuizTypes(types);

      setQuestions(questionsToUse);
      // 加载完成
      setIsLoading(false);
    } else {
      // 如果没有词汇数据，重定向到导入页面
      navigate(ROUTES.IMPORT);
    }
  }, [isLoading, vocabulary, navigate]);

  // 当前问题
  const currentQuestion = questions[currentQuestionIndex];
  
  // 当前测验类型
  const currentQuizType = quizTypes[currentQuestionIndex] || 'type-in';

  // 提交答案
  const submitAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    
    // 保存答案
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { answer, isCorrect }
    }));
    
    // 显示反馈
    setFeedback({
      isCorrect,
      correctAnswer: currentQuestion.answer,
      userAnswer: answer
    });
    setShowFeedback(true);
    
    // 如果回答正确，播放单词
    if (isCorrect) {
      playSpeech(currentQuestion.answer);
    }
    
    // 更新进度
    if (isCorrect) {
      setProgress({
        ...progress,
        correct: progress.correct + 1
      });
    } else {
      setProgress({
        ...progress,
        incorrect: progress.incorrect + 1
      });
    }
  };

  // 继续学习
  const continueToSummary = () => {
    navigate(ROUTES.SUMMARY);
  };  // 提供给 FeedbackMessage 的继续处理
  const handleContinue = () => {
    // 先隐藏反馈信息
    setShowFeedback(false);
    
    // 延迟足够长的时间以确保状态更新和动画完成不会导致闪烁
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 400); // 增加延时以匹配动画持续时间
  };

  // 重新开始测验
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
  };

  // 计算正确率
  const calculateAccuracy = () => {
    const answeredQuestions = Object.values(answers).length;
    if (answeredQuestions === 0) return 0;
    
    const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
    return Math.round((correctAnswers / answeredQuestions) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Spinner />
        <p className="mt-4 text-gray-600 dark:text-gray-300">准备测验中...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="quiz-page container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!quizCompleted ? (
        <>
          {/* 测验进度 */}
          <QuizProgress 
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
          
          <div className="mt-8 mb-6 text-center">
            <h2 className="text-2xl font-bold">测验</h2>
          </div>
          
          {/* 测验内容区域: 仅在未显示页面级反馈时渲染，避免重复Continue按钮 */}
          <AnimatePresence mode="wait" initial={false}>
            {!showFeedback && (
              <motion.div
                key={`question-${currentQuestionIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, type: "tween" }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto"
              >
                {/* 问题显示区域 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    {currentQuestion?.question}
                  </h3>
                  {/* 答题区域 - 根据题型渲染不同组件 */}
                  {currentQuizType === 'type-in' && currentQuestion && (
                    <TypeInQuiz
                      question={{
                        id: currentQuestion.id,
                        prompt: (currentQuestion as import('../types/quiz').TypeInQuestion).prompt,
                        answer: currentQuestion.answer,
                        example: (currentQuestion as import('../types/quiz').TypeInQuestion).example
                      }}
                      onAnswer={(_isCorrect, userAnswer) => submitAnswer(userAnswer)}
                    />
                  )}
                  {currentQuizType === 'choice' && currentQuestion && (
                    <ChoiceQuiz
                      question={{
                        id: currentQuestion.id,
                        prompt: (currentQuestion as import('../types/quiz').ChoiceQuestion).prompt,
                        choices: (currentQuestion as import('../types/quiz').ChoiceQuestion).choices.map(c => ({ id: c.id, text: c.content, isCorrect: c.isCorrect })),
                        example: (currentQuestion as import('../types/quiz').ChoiceQuestion).example
                      }}
                      onAnswer={(_isCorrect, choiceId) => {
                        const cq = currentQuestion as import('../types/quiz').ChoiceQuestion;
                        const selected = cq.choices.find(c => c.id === choiceId)?.content || '';
                        submitAnswer(selected);
                      }}
                    />
                  )}
                  {currentQuizType === 'drag-drop' && currentQuestion && (
                    <DragDropQuiz
                      question={{
                        id: currentQuestion.id,
                        words: (currentQuestion as import('../types/quiz').DragDropQuestion).words.map(w => ({ id: w.id, content: w.content })),
                        definitions: (currentQuestion as import('../types/quiz').DragDropQuestion).targets.map(t => ({ id: t.id, content: t.definition, correctWordId: t.answerId }))
                      }}
                      onAnswer={({ correct, total, answers }) => {
                        // Map word IDs to actual content
                        const dragQ = currentQuestion as import('../types/quiz').DragDropQuestion;
                        const wordMap = dragQ.words.reduce(
                          (map, w) => ({ ...map, [w.id]: w.content }),
                          {} as Record<string, string>
                        );
                        // 用户答案列表
                        const userWords = Object.values(answers).map(id => wordMap[id] || id);
                        const userAnswerStr = userWords.join(', ');
                        // 正确答案列表
                        const correctWords = dragQ.targets.map(t => wordMap[t.answerId] || '').join(', ');
                        const isCorrectDD = correct === total;
                        // 保存答案和反馈
                        setAnswers(prev => ({
                          ...prev,
                          [currentQuestionIndex]: { answer: userAnswerStr, isCorrect: isCorrectDD }
                        }));
                        setFeedback({
                          isCorrect: isCorrectDD,
                          correctAnswer: correctWords,
                          userAnswer: userAnswerStr
                        });
                        setShowFeedback(true);
                        // 更新进度
                        if (isCorrectDD) {
                          // 播放正确词汇内容
                          playSpeech(correctWords);
                          setProgress({ ...progress, correct: progress.correct + 1 });
                        } else {
                          setProgress({ ...progress, incorrect: progress.incorrect + 1 });
                        }
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 答题反馈 */}
          {showFeedback && (
            <div className="mt-6">
              <FeedbackMessage
                isCorrect={feedback.isCorrect}
                correctAnswer={feedback.correctAnswer}
                userAnswer={feedback.userAnswer}
                onContinue={handleContinue}
              />
            </div>
          )}
        </>
      ) : (
        // 测验完成结果
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">测验完成!</h2>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-blue-500 mb-2">
                {calculateAccuracy()}%
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                正确率
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                你答对了 {Object.values(answers).filter(a => a.isCorrect).length} 题，
                共 {questions.length} 题
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                label="重新测验"
                onClick={restartQuiz}
                className="bg-gray-500 hover:bg-gray-600"
              />
              <Button
                label="查看总结"
                onClick={continueToSummary}
                className="bg-blue-500 hover:bg-blue-600"
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default QuizPage;