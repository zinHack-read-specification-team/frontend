import { useEffect, useState } from 'react';
import axios from 'axios';

interface ErrorLog {
  message: string;
  timestamp: string;
  details?: any;
}

const StatusPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorLog, setErrorLog] = useState<ErrorLog | null>(null);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get('/api/v1/ping', {
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        });
        
        if (response.status === 200) {
          setStatus('success');
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
        }

        setErrorLog({
          message: error instanceof Error ? error.message : 'Неизвестная ошибка',
          timestamp: new Date().toISOString(),
          details: errorDetails
        });
      }
    };

    checkStatus();
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1b26] flex items-center justify-center p-6">
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center justify-center">
          {status === 'loading' && (
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
              </div>
              <p className="mt-6 text-xl text-gray-300">
                Проверка статуса сервера...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-8">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-green-400 mb-4">
                Все серверы работают штатно
              </h1>
              <p className="text-xl text-gray-400">
                Система полностью оперативна
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="w-full max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 mb-8">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-red-400 mb-4">
                Ошибка на сервере
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Произошла проблема при проверке статуса
              </p>
              
              <button
                onClick={() => setShowLog(!showLog)}
                className="inline-flex items-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 
                         text-red-400 rounded-lg transition-colors duration-200 text-lg gap-2
                         focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                  </path>
                </svg>
                <span>{showLog ? 'Скрыть лог' : 'Показать лог'}</span>
              </button>

              {showLog && errorLog && (
                <div className="mt-8 bg-[#1f2133] rounded-xl overflow-hidden shadow-xl text-left">
                  <div className="bg-[#252940] px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Время ошибки:</span>
                      <span className="text-gray-300">
                        {new Date(errorLog.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(errorLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default StatusPage; 