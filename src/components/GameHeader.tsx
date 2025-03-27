import React from 'react';

interface GameHeaderProps {
  level: number;
  lives: number;
  stars: number;
  score: number;
  onComplete: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  lives,
  stars,
  score,
  onComplete
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              Уровень {level}
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(lives)].map((_, i) => (
                <span key={i} className="text-red-500 text-2xl">❤️</span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-yellow-500 text-xl">
              {[...Array(stars)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              {score} очков
            </div>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200"
            >
              Завершить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader; 