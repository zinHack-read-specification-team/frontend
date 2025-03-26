import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        {/* Анимированная иконка */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 animate-pulse">
              <svg
                className="w-full h-full text-accent-light dark:text-accent-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Текст ошибки */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Страница не найдена
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Извините, но страница, которую вы ищете, не существует или была перемещена.
          </p>
        </div>

        {/* Кнопка возврата */}
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-accent-light dark:bg-accent-dark text-white rounded-lg 
                   hover:bg-accent-light/90 dark:hover:bg-accent-dark/90 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light 
                   dark:focus:ring-accent-dark transition-colors duration-200"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 