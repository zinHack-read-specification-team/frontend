import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="fixed w-full top-0 left-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Безопасная школа
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="#features"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Особенности
              </a>
              <a
                href="#topics"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Темы
              </a>
              <a
                href="#cta"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Начать обучение
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/teacher/auth/sign-in"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Войти
            </Link>
            <Link
              to="/teacher/auth/sign-up"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Регистрация
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="Переключить тему"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Открыть меню</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
          <a
            href="#features"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Особенности
          </a>
          <a
            href="#topics"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Темы
          </a>
          <a
            href="#cta"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Начать обучение
          </a>
          <Link
            to="/teacher/auth/sign-in"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Войти
          </Link>
          <Link
            to="/teacher/auth/sign-up"
            className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader; 