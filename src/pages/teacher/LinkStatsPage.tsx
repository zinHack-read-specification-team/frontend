import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';

interface GameResult {
  id: string;
  game_id: string;
  game_name: string;
  game_code: string;
  full_name: string;
  stars: number;
  score: number;
  created_at: string;
}

const LinkStatsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const code = searchParams.get('code');
      if (!code) {
        setError('Код не указан');
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Требуется авторизация');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`https://zin-hack-25.antalkon.ru/api/v1/data/stats/${code}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Требуется авторизация');
          } else {
            throw new Error('Ошибка загрузки данных');
          }
        } else {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        setError('Не удалось загрузить статистику');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
          <div className="text-center text-xl text-gray-700 dark:text-gray-300">
            Загрузка статистики...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Пожалуйста, проверьте код и попробуйте снова.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Статистика игры
          </h1>

          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                Пока нет результатов игры
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Имя игрока
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Очки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Звезды
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Дата
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {result.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {result.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {result.stars}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(result.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkStatsPage; 