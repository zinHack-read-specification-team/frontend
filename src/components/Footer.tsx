import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} читайте спецификацию team. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 