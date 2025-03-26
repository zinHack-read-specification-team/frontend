import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Безопасная школа. Все права защищены.
          </div>
          <div className="flex space-x-4">
            <Link
              to="/status"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Узнать работоспособность
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 