import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';

interface Scene {
  text: string;
  image: string;
}

interface Item {
  id: string;
  name: string;
  isHazardous: boolean;
}

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Level {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'interactive' | 'drag-n-drop';
  content: {
    scenes?: Scene[];
    items?: Item[];
    questions?: Question[];
  };
  isCompleted: boolean;
}

interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  stars: number;
}

const levels: Level[] = [
  {
    id: 1,
    title: 'Знакомство с огнём',
    description: 'Узнаем основные правила обращения с огнём',
    type: 'interactive',
    content: {
      scenes: [
        {
          text: 'Привет! Я твой помощник - Огнеборец. Сегодня мы научимся правилам пожарной безопасности!',
          image: '/assets/games/fire/firefighter.png'
        },
        {
          text: 'Огонь может быть как другом, так и врагом. Давай научимся правильно с ним обращаться!',
          image: '/assets/games/fire/fire-friend-enemy.png'
        }
      ]
    },
    isCompleted: false
  },
  {
    id: 2,
    title: 'Опасные предметы',
    description: 'Найди все опасные предметы в комнате',
    type: 'drag-n-drop',
    content: {
      items: [
        { id: 'matches', name: 'Спички', isHazardous: true },
        { id: 'candle', name: 'Свеча', isHazardous: true },
        { id: 'iron', name: 'Утюг', isHazardous: true },
        { id: 'toy', name: 'Игрушка', isHazardous: false },
        { id: 'book', name: 'Книга', isHazardous: false }
      ]
    },
    isCompleted: false
  },
  {
    id: 3,
    title: 'Правила безопасности',
    description: 'Проверь свои знания',
    type: 'quiz',
    content: {
      questions: [
        {
          text: 'Что нужно делать, если увидел пожар?',
          options: [
            'Спрятаться под кровать',
            'Позвонить в пожарную службу (01 или 112)',
            'Попытаться потушить самостоятельно',
            'Убежать на улицу'
          ],
          correctAnswer: 1
        },
        {
          text: 'Можно ли играть со спичками?',
          options: [
            'Да, если рядом взрослые',
            'Нет, никогда',
            'Да, если быть осторожным',
            'Да, только на улице'
          ],
          correctAnswer: 1
        }
      ]
    },
    isCompleted: false
  }
];

const FireGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    lives: 3,
    stars: 0
  });

  const [currentScene, setCurrentScene] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const currentLevel = levels.find(level => level.id === gameState.currentLevel);

  const [items, setItems] = useState<{
    available: Item[];
    hazardous: Item[];
    safe: Item[];
  }>({
    available: currentLevel?.type === 'drag-n-drop' ? currentLevel.content.items || [] : [],
    hazardous: [],
    safe: []
  });
  useEffect(() => {
    const level = levels.find(level => level.id === gameState.currentLevel);
    if (level?.type === 'drag-n-drop') {
      setItems({
        available: level.content.items || [],
        hazardous: [],
        safe: []
      });
    }
  }, [gameState.currentLevel]);

  const handleNextScene = () => {
    if (currentLevel?.type === 'interactive' && currentLevel.content.scenes) {
      if (currentScene < currentLevel.content.scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        completeLevelWithReward();
      }
    }
  };

  const completeLevelWithReward = () => {
    setShowLevelComplete(true);
    setGameState(prev => ({
      ...prev,
      score: prev.score + 100,
      stars: prev.stars + 1
    }));

    setTimeout(() => {
      setShowLevelComplete(false);
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1
      }));
      setCurrentScene(0);
    }, 2000);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId as 'available' | 'hazardous' | 'safe';
    const destList = destination.droppableId as 'available' | 'hazardous' | 'safe';

    const sourceItems = Array.from(items[sourceList]);
    const destItems = Array.from(items[destList]);
    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    const newItems = {
      ...items,
      [sourceList]: sourceItems,
      [destList]: destItems
    };

    setItems(newItems);

    if (sourceList === 'available') {
      const isCorrect = (movedItem.isHazardous && destList === 'hazardous') ||
                       (!movedItem.isHazardous && destList === 'safe');

      if (isCorrect) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 10
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          lives: prev.lives - 1
        }));
      }

      if (newItems.available.length === 0) {
        completeLevelWithReward();
      }
    }
  };

  const handleQuizAnswer = (questionIndex: number, selectedAnswer: number) => {
    const question = currentLevel?.content.questions[questionIndex];
    if (question && question.correctAnswer === selectedAnswer) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 20
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                Уровень {gameState.currentLevel}
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(gameState.lives)].map((_, i) => (
                  <span key={i} className="text-red-500 text-2xl">❤️</span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500 text-xl">
                {[...Array(gameState.stars)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {gameState.score} очков
              </div>
            </div>
          </div>
        </div>

        {/* Level Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLevel?.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {currentLevel?.description}
          </p>

          {/* Interactive Story */}
          {currentLevel?.type === 'interactive' && currentLevel.content.scenes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <img
                src={currentLevel.content.scenes[currentScene].image}
                alt="Scene"
                className="mx-auto mb-6 rounded-lg shadow-lg max-w-md"
              />
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
                {currentLevel.content.scenes[currentScene].text}
              </p>
              <button
                onClick={handleNextScene}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* Drag and Drop Game */}
          {currentLevel?.type === 'drag-n-drop' && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Доступные предметы
                  </h3>
                  <Droppable droppableId="available">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                      >
                        {items.available.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                              >
                                {item.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                    Опасные предметы
                  </h3>
                  <Droppable droppableId="hazardous">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                      >
                        {items.hazardous.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                              >
                                {item.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                    Безопасные предметы
                  </h3>
                  <Droppable droppableId="safe">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                      >
                        {items.safe.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                              >
                                {item.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </DragDropContext>
          )}

          {/* Quiz */}
          {currentLevel?.type === 'quiz' && currentLevel.content.questions && (
            <div className="space-y-8">
              {currentLevel.content.questions.map((question, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                  <h3 className="text-xl text-gray-900 dark:text-white mb-4">
                    {question.text}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleQuizAnswer(index, optionIndex)}
                        className="p-4 bg-white dark:bg-gray-700 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level Complete Modal */}
        <AnimatePresence>
          {showLevelComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Уровень пройден!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  +100 очков и новая звезда!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FireGame; 