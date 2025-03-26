import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-accent-light dark:text-accent-dark">
                Безопасная школа
              </Link>
            </div>
            {/* Десктопное меню */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/teacher/classes"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark"
              >
                Классы
              </Link>
              <Link
                to="/teacher/instructions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark"
              >
                Инструктажи
              </Link>
              <Link
                to="/teacher/help"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark"
              >
                Помощь
              </Link>
              <Link
                to="/teacher/settings"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark"
              >
                Настройки
              </Link>
            </nav>
          </div>

          {/* Мобильное меню */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-light dark:focus:ring-accent-dark"
            >
              <span className="sr-only">Открыть главное меню</span>
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

          {/* Десктопное меню пользователя */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                >
                  <span className="sr-only">Открыть меню пользователя</span>
                  <div className="h-8 w-8 rounded-full bg-accent-light dark:bg-accent-dark flex items-center justify-center text-white">
                    И
                  </div>
                </button>
              </div>
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/teacher/classes"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Классы
            </Link>
            <Link
              to="/teacher/instructions"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Инструктажи
            </Link>
            <Link
              to="/teacher/help"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Помощь
            </Link>
            <Link
              to="/teacher/settings"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Настройки
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Выйти
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 