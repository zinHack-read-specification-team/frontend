import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHeader from '../../../components/GameHeader';
import { useSearchParams } from 'react-router-dom';

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

interface FirefighterItem {
  id: string;
  name: string;
  description: string;
  image: string;
  isCorrect: boolean;
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
  type: 'quiz' | 'interactive' | 'drag-n-drop' | 'category-select' | 'video' | 'firefighter-kit';
  content: {
    scenes?: Scene[];
    items?: Item[];
    questions?: Question[];
    videoId?: string;
    firefighterItems?: FirefighterItem[];
  };
  isCompleted: boolean;
}

interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  stars: number;
}

interface GamePlayer {
  id: string;
  game_id: string;
  game_name: string;
  game_code: string;
  full_name: string;
  stars: number;
  score: number;
  created_at: string;
}

interface GameLog {
  request: {
    url: string;
    method: string;
    body: any;
  };
  response: any;
  error?: string;
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
      videoId: 'cTpyJ8lQUZs'
    },
    isCompleted: false
  },
  {
    id: 5,
    title: 'Собери набор пожарного',
    description: 'Выбери правильные предметы, которые нужны пожарному для работы',
    type: 'firefighter-kit',
    content: {
      firefighterItems: [
        {
          id: 'helmet',
          name: 'Каска',
          description: 'Защищает голову пожарного от падающих предметов и высокой температуры',
          image: '/assets/games/fire/helmet.png',
          isCorrect: true
        },
        {
          id: 'axe',
          name: 'Топор',
          description: 'Помогает пробираться через закрытые двери и преграды',
          image: '/assets/games/fire/axe.png',
          isCorrect: true
        },
        {
          id: 'hose',
          name: 'Пожарный рукав',
          description: 'Подает воду для тушения пожара',
          image: '/assets/games/fire/hose.png',
          isCorrect: true
        },
        {
          id: 'mask',
          name: 'Противогаз',
          description: 'Защищает органы дыхания от дыма',
          image: '/assets/games/fire/mask.png',
          isCorrect: true
        },
        {
          id: 'gloves',
          name: 'Перчатки',
          description: 'Защищают руки от ожогов и травм',
          image: '/assets/games/fire/gloves.png',
          isCorrect: true
        },
        {
          id: 'umbrella',
          name: 'Зонтик',
          description: 'Не является частью экипировки пожарного',
          image: '/assets/games/fire/umbrella.png',
          isCorrect: false
        },
        {
          id: 'toy',
          name: 'Игрушка',
          description: 'Не является частью экипировки пожарного',
          image: '/assets/games/fire/toy.png',
          isCorrect: false
        },
        {
          id: 'book',
          name: 'Книга',
          description: 'Не является частью экипировки пожарного',
          image: '/assets/games/fire/book.png',
          isCorrect: false
        }
      ]
    },
    isCompleted: false
  }
];

const FireGame: React.FC = () => {
  const [searchParams] = useSearchParams();
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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    hazardous: Item[];
    safe: Item[];
  }>({
    hazardous: [],
    safe: []
  });
  const [selectedFirefighterItems, setSelectedFirefighterItems] = useState<FirefighterItem[]>([]);
  const [showItemDescription, setShowItemDescription] = useState<string | null>(null);
  const [gamePlayer, setGamePlayer] = useState<GamePlayer | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<GameLog | null>(null);
  const [showLog, setShowLog] = useState(false);

  const currentLevel = levels.find(level => level.id === gameState.currentLevel);

  // Проверка кода доступа при загрузке
  useEffect(() => {
    const checkAccess = async () => {
      const code = searchParams.get('code');
      if (!code) {
        setError('Код доступа не указан');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://zin-hack-25.antalkon.ru/api/v1/user/check-link/${code}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError('У вас нет доступа к этой игре');
        }
      } catch (err) {
        setError('Произошла ошибка при проверке доступа');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [searchParams]);

  // Загрузка сохраненного состояния при старте
  useEffect(() => {
    const savedState = localStorage.getItem('fireGameState');
    const savedPlayerName = localStorage.getItem('fireGamePlayerName');
    const savedPlayer = localStorage.getItem('fireGamePlayer');

    if (savedState && savedPlayerName && savedPlayer) {
      setGameState(JSON.parse(savedState));
      setPlayerName(savedPlayerName);
      setGamePlayer(JSON.parse(savedPlayer));
      setGameStarted(true);
    }
  }, []);

  // Сохранение состояния при изменениях
  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem('fireGameState', JSON.stringify(gameState));
      localStorage.setItem('fireGamePlayerName', playerName);
    }
  }, [gameStarted, gameState, playerName]);

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

  const handleStartGame = async () => {
    if (!playerName.trim() || !userData) return;

    try {
      const requestBody = {
        code: userData.code,
        full_name: playerName.trim()
      };

      const response = await fetch('https://zin-hack-25.antalkon.ru/api/v1/game/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      setGamePlayer(responseData);
      setGameLog({
        request: {
          url: 'https://zin-hack-25.antalkon.ru/api/v1/game/register',
          method: 'POST',
          body: requestBody
        },
        response: responseData
      });
      
      localStorage.setItem('fireGamePlayer', JSON.stringify(responseData));
      
      setGameState({
        currentLevel: 1,
        score: 0,
        lives: 3,
        stars: 0
      });
      setCurrentScene(0);
      setSelectedAnswers([]);
      setShowResults(false);
      setShowGameComplete(false);
      setGameStarted(true);
      setRegistrationError(null);
    } catch (err) {
      setRegistrationError('Невозможно начать игру. Обратитесь в поддержку.');
      setGameLog({
        request: {
          url: 'https://zin-hack-25.antalkon.ru/api/v1/game/register',
          method: 'POST',
          body: {
            code: userData.code,
            full_name: playerName.trim()
          }
        },
        response: null,
        error: err instanceof Error ? err.message : 'Неизвестная ошибка'
      });
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Пожалуйста, проверьте код доступа и попробуйте снова.
          </p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
        <GameHeader
          level={gameState.currentLevel}
          lives={gameState.lives}
          stars={gameState.stars}
          score={gameState.score}
          onComplete={() => {}}
        />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Игра "Пожарная безопасность"
            </h1>
            {userData && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  Вы присоединились от школы "{userData.school_num}", класс "{userData.class}"
                </p>
              </div>
            )}
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
      
      // Проверяем, является ли текущий уровень последним
      if (gameState.currentLevel === levels.length) {
        setShowGameComplete(true);
        // Отправляем запрос после показа страницы завершения
        handleFinalLevelComplete();
      } else {
        setGameState(prev => ({
          ...prev,
          currentLevel: prev.currentLevel + 1
        }));
        setCurrentScene(0);
      }
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

    questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer === question.correctAnswer) {
        score += 100;
      } else {
        score -= 100;
      }
    });

    setGameState(prev => ({
      ...prev,
      score: prev.score + score
    }));

    setShowResults(true);
  };

  const handleVideoEnd = () => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 200,
      stars: prev.stars + 1
    }));
  };

  const handleGameComplete = async () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите завершить игру? Весь прогресс будет потерян.'
    );

    if (confirmed) {
      localStorage.removeItem('fireGameState');
      localStorage.removeItem('fireGamePlayerName');
      localStorage.removeItem('fireGamePlayer');
      
      setGameState({
        currentLevel: 1,
        score: 0,
        lives: 3,
        stars: 0
      });
      setPlayerName('');
      setGameStarted(false);
      setShowGameComplete(true);
    }
  };

  const handleFirefighterItemClick = (item: FirefighterItem) => {
    if (selectedFirefighterItems.find(i => i.id === item.id)) {
      setSelectedFirefighterItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSelectedFirefighterItems(prev => [...prev, item]);
    }
  };

  const handleCheckFirefighterKit = () => {
    const correctItems = currentLevel?.content.firefighterItems?.filter(item => item.isCorrect) || [];
    const selectedCorrectItems = selectedFirefighterItems.filter(item => item.isCorrect);
    const selectedIncorrectItems = selectedFirefighterItems.filter(item => !item.isCorrect);

    if (selectedCorrectItems.length === correctItems.length && selectedIncorrectItems.length === 0) {
      completeLevelWithReward();
    } else {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));
      setShowError(true);
      setErrorMessage('Неправильно! Проверь свой выбор еще раз.');
    }
  };

  const handleFinalLevelComplete = async () => {
    if (!gamePlayer) return;

    try {
      const requestBody = {
        stars: gameState.stars,
        score: gameState.score
      };

      const response = await fetch(`https://zin-hack-25.antalkon.ru/api/v1/game/finish/${gamePlayer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка сохранения');
      }

      setGameLog({
        request: {
          url: `https://zin-hack-25.antalkon.ru/api/v1/game/final/${gamePlayer.id}`,
          method: 'PUT',
          body: requestBody
        },
        response: responseData
      });

      localStorage.removeItem('fireGameState');
      localStorage.removeItem('fireGamePlayerName');
      localStorage.removeItem('fireGamePlayer');
    } catch (err) {
      setSaveError('Не удалось сохранить результат. Попробуйте еще раз.');
      setGameLog({
        request: {
          url: `https://zin-hack-25.antalkon.ru/api/v1/game/final/${gamePlayer.id}`,
          method: 'PUT',
          body: {
            stars: gameState.stars,
            score: gameState.score
          }
        },
        response: null,
        error: err instanceof Error ? err.message : 'Неизвестная ошибка'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      {gameStarted && (
        <GameHeader
          level={gameState.currentLevel}
          lives={gameState.lives}
          stars={gameState.stars}
          score={gameState.score}
          onComplete={handleGameComplete}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
        {/* Game Content */}
        {!gameStarted ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Игра "Пожарная безопасность"
            </h1>
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
        ) : (
          <>
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
                  
                  {!showResults && (
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
                      onEnded={handleVideoEnd}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      onClick={completeLevelWithReward}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200"
                    >
                      Далее
                    </button>
                  </div>
                </div>
              )}

              {/* Firefighter Kit */}
              {currentLevel?.type === 'firefighter-kit' && currentLevel.content.firefighterItems && (
                <div className="space-y-8">
                  <div className="text-center text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Выбери предметы, которые нужны пожарному для работы. Будь внимателен - некоторые предметы лишние!
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentLevel.content.firefighterItems.map((item) => {
                      const isSelected = selectedFirefighterItems.some(i => i.id === item.id);
                      
                      return (
                        <div
                          key={item.id}
                          className={`relative bg-white dark:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all transform hover:scale-105 ${
                            isSelected ? 'ring-4 ring-blue-500 dark:ring-blue-400' : ''
                          }`}
                          onClick={() => handleFirefighterItemClick(item)}
                          onMouseEnter={() => setShowItemDescription(item.id)}
                          onMouseLeave={() => setShowItemDescription(null)}
                        >
                          <div className="aspect-square relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-center mt-2 font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          
                          {showItemDescription === item.id && (
                            <div className="absolute z-10 left-0 right-0 bottom-full mb-2 p-2 bg-black/80 text-white text-sm rounded-lg">
                              {item.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleCheckFirefighterKit}
                      disabled={selectedFirefighterItems.length === 0}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Проверить набор
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center max-w-2xl w-full mx-4">
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
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Вы отлично справились с заданиями по пожарной безопасности!
                    </p>

                    {gameLog && (
                      <div className="mt-6">
                        <div className={`p-4 rounded-lg mb-4 ${
                          gameLog.error ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          <p className={gameLog.error ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}>
                            {gameLog.error ? 'Произошла ошибка при сохранении результатов' : 'Результаты успешно сохранены'}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setShowLog(!showLog)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                        >
                          {showLog ? 'Скрыть детальный лог' : 'Показать детальный лог'}
                        </button>

                        {showLog && (
                          <div className="mt-4 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Запрос:</h4>
                            <pre className="text-sm text-gray-700 dark:text-gray-300 mb-4 overflow-x-auto">
                              {JSON.stringify(gameLog.request, null, 2)}
                            </pre>
                            
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ответ:</h4>
                            <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                              {gameLog.error ? gameLog.error : JSON.stringify(gameLog.response, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {registrationError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {registrationError}
            </h1>
            <button
              onClick={() => setRegistrationError(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {saveError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {saveError}
            </h1>
            <button
              onClick={() => setSaveError(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireGame;