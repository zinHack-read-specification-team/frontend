import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';

interface UserData {
  id: string;
  code: string;
  user_id: string;
  game_name: string;
  school_num: string;
  class: string;
  comment: string;
  created_at: string;
}

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
  explanation: string;
}

interface Level {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'interactive' | 'drag-n-drop' | 'category-select' | 'video';
  content: {
    scenes?: Scene[];
    items?: Item[];
    questions?: Question[];
    videoId?: string;
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
    description: 'Выбери правильную категорию для каждого предмета',
    type: 'category-select',
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
          correctAnswer: 1,
          explanation: 'При пожаре нужно немедленно позвонить в пожарную службу по номеру 01 или 112. Это самое важное действие, которое может спасти жизни.'
        },
        {
          text: 'Можно ли играть со спичками?',
          options: [
            'Да, если рядом взрослые',
            'Нет, никогда',
            'Да, если быть осторожным',
            'Да, только на улице'
          ],
          correctAnswer: 1,
          explanation: 'Играть со спичками категорически запрещено! Это очень опасно и может привести к пожару.'
        },
        {
          text: 'Что нужно делать, если загорелась одежда?',
          options: [
            'Бежать за водой',
            'Снять одежду',
            'Упасть и кататься по полу',
            'Позвать на помощь'
          ],
          correctAnswer: 2,
          explanation: 'Если загорелась одежда, нужно немедленно упасть на пол и кататься, чтобы сбить пламя. Бежать нельзя - это усилит горение.'
        },
        {
          text: 'Как правильно эвакуироваться из горящего здания?',
          options: [
            'Бежать как можно быстрее',
            'Идти спокойно, пригнувшись к полу',
            'Пользоваться лифтом',
            'Прыгать из окна'
          ],
          correctAnswer: 1,
          explanation: 'При эвакуации нужно идти спокойно, пригнувшись к полу, так как дым поднимается вверх. Пользоваться лифтом нельзя!'
        }
      ]
    },
    isCompleted: false
  },
  {
    id: 4,
    title: 'Видео о пожарной безопасности',
    description: 'Посмотри обучающее видео',
    type: 'video',
    content: {
      videoId: 'abc123xyz' // Замените на реальный ID видео
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const [currentScene, setCurrentScene] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [canProceed, setCanProceed] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [videoStartTime, setVideoStartTime] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  const currentLevel = levels.find(level => level.id === gameState.currentLevel);

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    hazardous: Item[];
    safe: Item[];
  }>({
    hazardous: [],
    safe: []
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Получаем код из URL параметров
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          setError('Не указан код доступа');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`https://zin-hack-25.antalkon.ru/api/v1/user/check-link/${code}`);
        
        if (!response.ok) {
          setError('Нет доступа к этому интерактивному уроку');
          setIsLoading(false);
          return;
        }

        const data: UserData = await response.json();
        
        if (data.game_name !== 'fire') {
          setError('Неправильная игра');
          setIsLoading(false);
          return;
        }

        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Произошла ошибка при проверке доступа');
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  // Загрузка сохраненного состояния при старте
  useEffect(() => {
    const savedState = localStorage.getItem('fireGameState');
    const savedPlayerName = localStorage.getItem('fireGamePlayerName');
    const savedUserData = localStorage.getItem('fireGameUserData');

    if (savedState && savedPlayerName && savedUserData) {
      setGameState(JSON.parse(savedState));
      setPlayerName(savedPlayerName);
      setUserData(JSON.parse(savedUserData));
      setGameStarted(true);
    }
  }, []);

  // Сохранение состояния при изменениях
  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem('fireGameState', JSON.stringify(gameState));
      localStorage.setItem('fireGamePlayerName', playerName);
      if (userData) {
        localStorage.setItem('fireGameUserData', JSON.stringify(userData));
      }
    }
  }, [gameStarted, gameState, playerName, userData]);

  // Инициализация уровня
  useEffect(() => {
    if (gameStarted && currentLevel) {
      if (currentLevel.type === 'category-select' && currentLevel.content.items) {
        setItems(currentLevel.content.items);
        setSelectedItems({
          hazardous: [],
          safe: []
        });
        setSelectedItem(null);
        setShowError(false);
        setErrorMessage('');
      }
      if (currentLevel.type === 'quiz') {
        setSelectedAnswers([]);
        setShowResults(false);
      }
    }
  }, [gameStarted, currentLevel]);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setGameState({
        currentLevel: 1,
        score: 0,
        lives: 3,
        stars: 0
      });
      setCurrentScene(0);
      setSelectedAnswers([]);
      setShowResults(false);
      setVideoEnded(false);
      setShowGameComplete(false);
      setGameStarted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
        <div className="text-xl text-gray-700 dark:text-gray-300">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Игра "Пожарная безопасность"
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Школа: {userData?.school_num}<br />
            Класс: {userData?.class}
          </p>
          <div className="mb-6">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Введите ваше имя и фамилию
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Иван Иванов"
            />
          </div>
          <button
            onClick={handleStartGame}
            disabled={!playerName.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Начать игру
          </button>
        </div>
      </div>
    );
  }

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

  const handleCategorySelect = (category: 'hazardous' | 'safe') => {
    if (!selectedItem) return;

    const isCorrect = (selectedItem.isHazardous && category === 'hazardous') ||
                     (!selectedItem.isHazardous && category === 'safe');

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10
      }));
      setSelectedItems(prev => ({
        ...prev,
        [category]: [...prev[category], selectedItem]
      }));
      setSelectedItem(null);
      setShowError(false);
      setErrorMessage('');

      // Проверяем, все ли предметы распределены
      if (selectedItems.hazardous.length + selectedItems.safe.length + 1 === items.length) {
        completeLevelWithReward();
      }
    } else {
      setShowError(true);
      setErrorMessage(`Неправильно! ${selectedItem.name} ${selectedItem.isHazardous ? 'опасный' : 'безопасный'} предмет.`);
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleCheckAnswers = () => {
    const questions = currentLevel?.content.questions;
    if (!questions) return;

    let score = 0;
    let hasIncorrect = false;

    questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer === question.correctAnswer) {
        score += 100;
      } else {
        score -= 100;
        hasIncorrect = true;
      }
    });

    setGameState(prev => ({
      ...prev,
      score: prev.score + score
    }));

    setShowResults(true);
  };

  const canCheckAnswers = () => {
    const questions = currentLevel?.content.questions;
    if (!questions) return false;
    return selectedAnswers.length === questions.length;
  };

  const handleVideoStart = () => {
    setVideoStartTime(Date.now());
  };

  const handleVideoProgress = (event: any) => {
    if (event.target && event.target.getCurrentTime) {
      setVideoProgress(event.target.getCurrentTime());
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setGameState(prev => ({
      ...prev,
      score: prev.score + 200,
      stars: prev.stars + 1
    }));
  };

  const handleVideoReady = (event: any) => {
    if (event.target && event.target.getDuration) {
      setVideoDuration(event.target.getDuration());
    }
  };

  const handleGameComplete = () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите завершить игру? Весь прогресс будет потерян.'
    );

    if (confirmed) {
      localStorage.removeItem('fireGameState');
      localStorage.removeItem('fireGamePlayerName');
      localStorage.removeItem('fireGameUserData');
      
      setGameState({
        currentLevel: 1,
        score: 0,
        lives: 3,
        stars: 0
      });
      setPlayerName('');
      setUserData(null);
      setGameStarted(false);
      setShowGameComplete(true);
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
              <button
                onClick={handleGameComplete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200"
              >
                Завершить
              </button>
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

          {/* Category Selection Game */}
          {currentLevel?.type === 'category-select' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Доступные предметы
                </h3>
                <div className="min-h-[200px] bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  {items.map((item) => {
                    const isSelected = selectedItem?.id === item.id || 
                                    selectedItems.hazardous.find(i => i.id === item.id) || 
                                    selectedItems.safe.find(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                          isSelected ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => !isSelected && setSelectedItem(item)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                  Опасные предметы
                </h3>
                <div className="min-h-[200px] bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  {selectedItems.hazardous.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm"
                    >
                      {item.name}
                    </div>
                  ))}
                  {selectedItem && (
                    <button
                      onClick={() => handleCategorySelect('hazardous')}
                      className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Поместить сюда
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                  Безопасные предметы
                </h3>
                <div className="min-h-[200px] bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  {selectedItems.safe.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm"
                    >
                      {item.name}
                    </div>
                  ))}
                  {selectedItem && (
                    <button
                      onClick={() => handleCategorySelect('safe')}
                      className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Поместить сюда
                    </button>
                  )}
                </div>
              </div>
            </div>
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
                        disabled={showResults}
                        className={`p-4 bg-white dark:bg-gray-700 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 ${
                          showResults && optionIndex === question.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : ''
                        } ${
                          showResults && optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer ? 'bg-red-100 dark:bg-red-900/30' : ''
                        } ${
                          selectedAnswers[index] === optionIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {showResults && selectedAnswers[index] !== question.correctAnswer && (
                    <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <p className="text-red-700 dark:text-red-300">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {!showResults && canCheckAnswers() && (
                <button
                  onClick={handleCheckAnswers}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Проверить ответы
                </button>
              )}

              {showResults && (
                <button
                  onClick={completeLevelWithReward}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200"
                >
                  Перейти к следующему уровню
                </button>
              )}
            </div>
          )}

          {/* Video Level */}
          {currentLevel?.type === 'video' && (
            <div className="space-y-6">
              <div className="text-center text-lg text-gray-700 dark:text-gray-300 mb-4">
                Посмотри мультфильм по пожарной безопасности, досмотри его до конца и получи 200 очков и звезду!
              </div>
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/cTpyJ8lQUZs?enablejsapi=1`}
                  title="Пожарная безопасность"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  onLoad={handleVideoReady}
                  onEnded={handleVideoEnd}
                />
              </div>
              <div className="text-center">
                <button
                  onClick={handleGameComplete}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200"
                >
                  Далее
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <p className="text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
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

        {/* Game Complete Modal */}
        <AnimatePresence>
          {showGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Поздравляем! Вы прошли игру!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Набрано очков: {gameState.score}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Заработано звёзд: {gameState.stars}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Вы отлично справились с заданиями по пожарной безопасности!
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