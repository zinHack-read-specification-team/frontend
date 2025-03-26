import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

interface ErrorLog {
  message: string;
  timestamp: string;
  details?: any;
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency?: number;
}

const StatusPage = () => {
  const { theme, setTheme } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorLog, setErrorLog] = useState<ErrorLog | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
    { name: 'API Сервер', status: 'operational', latency: 0 },
    { name: 'База данных', status: 'operational', latency: 0 },
    { name: 'Кэш', status: 'operational', latency: 0 },
    { name: 'Очередь задач', status: 'operational', latency: 0 }
  ]);

  const checkStatus = async () => {
    const startTime = performance.now();
    try {
      const response = await axios.get('/api/v1/ping', {
        headers: {
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
      
      const latency = Math.round(performance.now() - startTime);
      
      if (response.status === 200) {
        setStatus('success');
        setSystemStatuses(prev => prev.map(s => 
          s.name === 'API Сервер' ? { ...s, status: 'operational', latency } : s
        ));
      }
    } catch (error) {
      setStatus('error');
      let errorDetails = {};
      
      if (axios.isAxiosError(error)) {
        errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        };
        setSystemStatuses(prev => prev.map(s => 
          s.name === 'API Сервер' ? { ...s, status: 'down' } : s
        ));
      }

      setErrorLog({
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        timestamp: new Date().toISOString(),
        details: errorDetails
      });
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Проверка каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'text-green-500 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'down':
        return 'text-red-500 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <nav className="border-b border-gray-200/10 dark:border-gray-700/10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-accent-light dark:text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Статус системы
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                На главную
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-8">
          {/* Основной статус */}
          <section className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-light dark:border-accent-dark border-t-transparent"></div>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                  Проверка статуса сервера...
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                  <svg className="w-10 h-10 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Все системы работают штатно
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Все сервисы функционируют нормально
                </p>
              </div>
            )}
            
            {status === 'error' && (
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                  <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Обнаружены проблемы
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Некоторые сервисы могут быть недоступны
                </p>
                
                <button
                  onClick={() => setShowLog(!showLog)}
                  className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 
                           text-red-700 dark:text-red-300 rounded-lg transition-colors
                           hover:bg-red-200 dark:hover:bg-red-900/30 gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span>{showLog ? 'Скрыть лог' : 'Показать лог'}</span>
                </button>
              </div>
            )}
          </section>

          {/* Статус компонентов */}
          <section className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Статус компонентов</h2>
            <div className="divide-y divide-gray-200/10 dark:divide-gray-700/10">
              {systemStatuses.map((system) => (
                <div key={system.name} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-900 dark:text-gray-100">{system.name}</span>
                    {system.latency !== undefined && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {system.latency}ms
                      </span>
                    )}
                  </div>
                  <span className={`font-medium ${getStatusColor(system.status)}`}>
                    {system.status === 'operational' ? 'Работает' :
                     system.status === 'degraded' ? 'Замедление' : 'Недоступно'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Время последней проверки */}
          <section className="text-center text-sm text-gray-500 dark:text-gray-400">
            Последняя проверка: {lastCheck.toLocaleString()}
          </section>

          {/* Лог ошибок */}
          {status === 'error' && showLog && errorLog && (
            <section className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-900 dark:text-gray-100">Время ошибки:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(errorLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <pre className="text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(errorLog.details, null, 2)}
                </pre>
              </div>
            </section>
          )}

          {/* Футер */}
          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/10 dark:border-gray-700/10 pt-8">
            © {new Date().getFullYear()} Система мониторинга
          </footer>
        </div>
      </main>
    </div>
  );
};

export default StatusPage; 