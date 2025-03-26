import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="fixed w-full top-0 left-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/teacher" 
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Безопасная школа
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/teacher/classes"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Классы
              </Link>
              <Link
                to="/teacher/instructions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Инструктажи
              </Link>
              <Link
                to="/teacher/help"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Помощь
              </Link>
              <Link
                to="/teacher/settings"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Настройки
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="text-sm font-medium">{user?.name}</span>
                <svg
                  className={`h-5 w-5 transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
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
          <Link
            to="/teacher/classes"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Классы
          </Link>
          <Link
            to="/teacher/instructions"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Инструктажи
          </Link>
          <Link
            to="/teacher/help"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Помощь
          </Link>
          <Link
            to="/teacher/settings"
            className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Настройки
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 