import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import FeedbackMessage from './FeedbackMessage';

interface DragItem {
  id: string;
  content: string;
}

interface DropTarget {
  id: string;
  content: string; // 释义或提示
  correctAnswerId: string; // 对应的正确单词ID
  answerId: string | null; // 用户放入的单词ID
}

interface DragDropQuizProps {
  question: {
    id: string;
    words: DragItem[]; // 需要拖拽的单词
    definitions: { id: string; content: string; correctWordId: string; example?: string }[]; // 目标释义
  };
  onAnswer: (results: { correct: number; total: number; answers: Record<string, string> }) => void;
}

const DragDropQuiz: React.FC<DragDropQuizProps> = ({ question, onAnswer }) => {
  const [draggableItems, setDraggableItems] = useState<DragItem[]>([]);
  const [dropTargets, setDropTargets] = useState<DropTarget[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    // 打乱单词顺序
    const shuffledWords = [...question.words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }
    
    setDraggableItems(shuffledWords);
    
    // 初始化释义目标区域
    setDropTargets(
      question.definitions.map(def => ({
        id: def.id,
        content: def.content,
        correctAnswerId: def.correctWordId,
        answerId: null
      }))
    );
  }, [question]);
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // 拖拽被取消
    if (!destination) return;
    
    // 从可拖拽区域拖到释义区域
    if (source.droppableId === 'words' && destination.droppableId.startsWith('def-')) {
      const defId = destination.droppableId.replace('def-', '');
      const draggedItemId = draggableItems[source.index].id;
      
      // 目标已经有单词，不做处理
      if (dropTargets.find(target => target.id === defId)?.answerId !== null) return;
      
      // 更新释义区域状态
      setDropTargets(prev => 
        prev.map(target => 
          target.id === defId 
            ? { ...target, answerId: draggedItemId } 
            : target
        )
      );
      
      // 从可拖拽区域移除该单词
      setDraggableItems(prev => prev.filter((_, index) => index !== source.index));
      
      // 检查是否所有释义都已匹配
      const updatedTargets = dropTargets.map(target => 
        target.id === defId ? { ...target, answerId: draggedItemId } : target
      );
      
      if (updatedTargets.every(target => target.answerId !== null)) {
        setCompleted(true);
      }
    }
    
    // 从释义区域拖回可拖拽区域
    if (source.droppableId.startsWith('def-') && destination.droppableId === 'words') {
      const defId = source.droppableId.replace('def-', '');
      const target = dropTargets.find(t => t.id === defId);
      
      if (target && target.answerId) {
        // 找到对应的单词
        const word = question.words.find(w => w.id === target.answerId);
        
        if (word) {
          // 将单词放回可拖拽区域
          setDraggableItems(prev => [...prev, word]);
          
          // 清除释义区域的答案
          setDropTargets(prev => 
            prev.map(t => 
              t.id === defId ? { ...t, answerId: null } : t
            )
          );
        }
      }
    }
  };
  
  const handleCheckAnswers = () => {
    const correctCount = dropTargets.filter(t => t.answerId === t.correctAnswerId).length;
    const answers = dropTargets.reduce((acc, t) => ({...acc, [t.id]: t.answerId || ''}), {} as Record<string, string>);
    
    setShowFeedback(true);
    onAnswer({
      correct: correctCount,
      total: dropTargets.length,
      answers
    });
  };
  
  const isAllCorrect = dropTargets.every(t => t.answerId === t.correctAnswerId);
  
  return (
    <div className="w-full">
      {showFeedback ? (
        <FeedbackMessage
          isCorrect={isAllCorrect}
          correctAnswer="所有匹配已显示"
          example={`正确匹配: ${dropTargets.filter(t => t.answerId === t.correctAnswerId).length}/${dropTargets.length}`}
          onContinue={() => setShowFeedback(false)}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">将单词拖放到对应的释义处</h3>
            
            <Droppable droppableId="words" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-2 p-4 min-h-[80px] bg-gray-50 rounded-lg border border-gray-200"
                >
                  {draggableItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-3 py-2 bg-white rounded-md border shadow-sm
                            ${snapshot.isDragging ? 'shadow-md' : ''}
                          `}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          
          <div className="space-y-4">
            {dropTargets.map((target) => (
              <div key={target.id} className="flex items-center">
                <div className="w-2/3 p-3 bg-gray-100 rounded-l-md">
                  {target.content}
                </div>
                
                <Droppable droppableId={`def-${target.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-1/3 h-[50px] flex items-center justify-center p-2
                        border-2 rounded-r-md border-dashed
                        ${snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                      `}
                    >
                      {target.answerId && (
                        <Draggable draggableId={target.answerId} index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-full text-center px-2 py-1 bg-white rounded border shadow-sm"
                            >
                              {question.words.find(w => w.id === target.answerId)?.content}
                            </div>
                          )}
                        </Draggable>
                      )}
                      {!target.answerId && '拖放到这里'}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          
          {completed && (
            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                onClick={handleCheckAnswers}
              >
                检查答案
              </button>
            </div>
          )}
        </DragDropContext>
      )}
    </div>
  );
};

export default DragDropQuiz;