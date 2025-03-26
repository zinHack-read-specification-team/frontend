import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  useEffect(() => {
    // Добавляем отступ для хедера
    document.body.style.paddingTop = '4rem';
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-light/20 to-accent-dark/20 dark:from-accent-dark/20 dark:to-accent-light/20" />
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl animate-fade-in">
                  <span className="block">Безопасная школа</span>
                  <span className="block text-accent-light dark:text-accent-dark">Увлекательное обучение безопасности</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up">
                  Интерактивная платформа для обучения детей правилам безопасности в игровой форме. Сделайте процесс обучения увлекательным и эффективным!
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in-up">
                  <div className="rounded-md shadow">
                    <Link
                      to="/teacher/auth/sign-up"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-light hover:bg-accent-dark md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                    >
                      Начать бесплатно
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/teacher/auth/sign-in"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-accent-light bg-accent-light/10 hover:bg-accent-light/20 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      Войти
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-accent-light dark:text-accent-dark font-semibold tracking-wide uppercase">Особенности</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Почему выбирают нас?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Интерактивные уроки */}
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-accent-light text-white transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Интерактивные уроки</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Увлекательные сценарии и симуляции для обучения правилам безопасности в игровой форме
                  </p>
                </div>
              </div>

              {/* Прогресс обучения */}
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-accent-light text-white transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Отслеживание прогресса</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Учителя могут следить за успеваемостью каждого ученика и анализировать результаты
                  </p>
                </div>
              </div>

              {/* Сертификаты */}
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-accent-light text-white transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Сертификаты</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Ученики получают красивые сертификаты после успешного прохождения уроков
                  </p>
                </div>
              </div>

              {/* Геймификация */}
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-accent-light text-white transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Геймификация</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Система достижений и наград мотивирует детей к обучению
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div id="topics" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-accent-light dark:text-accent-dark font-semibold tracking-wide uppercase">Темы</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Чему научатся дети?
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Пожарная безопасность */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Пожарная безопасность</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Правила поведения при пожаре, эвакуация, использование огнетушителя
                </p>
              </div>

              {/* Безопасность на воде */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Безопасность на воде</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Правила поведения на воде, спасение утопающих, оказание первой помощи
                </p>
              </div>

              {/* Чрезвычайные ситуации */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Чрезвычайные ситуации</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Действия при землетрясении, наводнении, урагане и других стихийных бедствиях
                </p>
              </div>

              {/* Безопасность в школе */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Безопасность в школе</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Правила поведения в школе, профилактика травматизма
                </p>
              </div>

              {/* Безопасность на дороге */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Безопасность на дороге</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Правила дорожного движения, безопасное поведение на улице
                </p>
              </div>

              {/* Кибербезопасность */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Кибербезопасность</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Безопасное использование интернета, защита от кибербуллинга
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" className="bg-accent-light dark:bg-accent-dark">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Готовы начать обучение?</span>
            <span className="block text-accent-dark dark:text-accent-light">Присоединяйтесь к нам сегодня!</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/teacher/auth/sign-up"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-accent-light bg-white hover:bg-accent-light/10 transition-all duration-200 transform hover:scale-105"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 