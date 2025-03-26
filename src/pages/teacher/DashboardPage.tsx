import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Приветствие */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
          Добро пожаловать в "Безопасная школа"
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Управляйте инструктажами и следите за безопасностью ваших учеников
        </p>
      </div>

      {/* Основные разделы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Классы */}
        <Link to="/teacher/classes" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-accent-light/10 dark:bg-accent-dark/10">
              <svg className="w-6 h-6 text-accent-light dark:text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Классы</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Управляйте списком классов и учеников
          </p>
        </Link>

        {/* Инструктажи */}
        <Link to="/teacher/instructions" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-accent-light/10 dark:bg-accent-dark/10">
              <svg className="w-6 h-6 text-accent-light dark:text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Инструктажи</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Создавайте и проводите инструктажи по безопасности
          </p>
        </Link>

        {/* Статистика */}
        <Link to="/teacher/status" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-accent-light/10 dark:bg-accent-dark/10">
              <svg className="w-6 h-6 text-accent-light dark:text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Статистика</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Просматривайте статистику по инструктажам
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage; 