import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CreateLinkForm {
  game_name: string;
  school_num: string;
  class: string;
  comment: string;
}

interface CreateLinkResponse {
  code: string;
}

interface Link {
  id: string;
  code: string;
  user_id: string;
  game_name: string;
  school_num: string;
  class: string;
  comment: string;
  created_at: string;
}

const LinksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [formData, setFormData] = useState<CreateLinkForm>({
    game_name: 'fire',
    school_num: 'Дуплекс',
    class: '1А',
    comment: 'Пусто'
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('https://zin-hack-25.antalkon.ru/api/v1/data/links', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке ссылок:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://zin-hack-25.antalkon.ru/api/v1/data/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data: CreateLinkResponse = await response.json();

      if (response.ok) {
        setGeneratedLink(`https://zin-hack-25.antalkon.ru/school/games/${formData.game_name}?code=${data.code}`);
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
        fetchLinks(); // Обновляем список ссылок
      } else {
        setError('Произошла ошибка при создании ссылки');
      }
    } catch (err) {
      setError('Произошла ошибка при подключении к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
  };

  const shareLink = async (link: string, school: string, className: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ссылка на игру',
          text: `Игра для ${school} ${className}`,
          url: link
        });
      } catch (err) {
        console.error('Ошибка при шаринге:', err);
      }
    }
  };

  const openQRModal = (link: Link) => {
    setSelectedLink(link);
    setIsQRModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getGameName = (name: string) => {
    const games: Record<string, string> = {
      fire: 'Пожар',
      flood: 'Наводнение',
      earthquake: 'Землетрясение'
    };
    return games[name] || name;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление ссылками</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Создать ссылку
          </button>
        </div>

        {/* Список ссылок */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Игра</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Школа</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Класс</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Создано</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Код</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getGameName(link.game_name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {link.school_num || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {link.class || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(link.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {link.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => window.open(`https://zin-hack-25.antalkon.ru/school/games/${link.game_name}?code=${link.code}`, '_blank')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        title="Открыть ссылку"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openQRModal(link)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        title="Показать QR-код"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 0h-2m2 0v4m-6 0h-2m2 0v4m-6-4h2m-2 0v4m0-11v-4m0 0h2m-2 0v4m0 0h2m-2 0v4m6-4h2m-2 0v4m0-11v-4m0 0h2m-2 0v4m0 0h2m-2 0v4m6-4h2m-2 0v4m0-11v-4m0 0h2m-2 0v4m0 0h2m-2 0v4m6-4h2m-2 0v4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Модальное окно с QR-кодом */}
        {isQRModalOpen && selectedLink && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  QR-код для доступа
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedLink.school_num} {selectedLink.class}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getGameName(selectedLink.game_name)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={`https://zin-hack-25.antalkon.ru/school/games/${selectedLink.game_name}?code=${selectedLink.code}`}
                    readOnly
                    className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm font-mono select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://zin-hack-25.antalkon.ru/school/games/${selectedLink.game_name}?code=${selectedLink.code}`)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    title="Копировать ссылку"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className="p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                    <QRCodeSVG
                      value={`https://zin-hack-25.antalkon.ru/school/games/${selectedLink.game_name}?code=${selectedLink.code}`}
                      size={300}
                      level="H"
                      includeMargin
                      className="dark:invert"
                      style={{ width: '300px', height: '300px' }}
                    />
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      Отсканируйте для перехода
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => shareLink(`https://zin-hack-25.antalkon.ru/school/games/${selectedLink.game_name}?code=${selectedLink.code}`, selectedLink.school_num, selectedLink.class)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                  >
                    Поделиться
                  </button>
                  <button
                    onClick={() => setIsQRModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно создания ссылки */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Создать новую ссылку</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Игра
                  </label>
                  <select
                    value={formData.game_name}
                    onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="fire">Пожар</option>
                    <option value="flood">Наводнение</option>
                    <option value="earthquake">Землетрясение</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Школа
                  </label>
                  <input
                    type="text"
                    value={formData.school_num}
                    onChange={(e) => setFormData({ ...formData, school_num: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Класс
                  </label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Комментарий
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Создание...' : 'Создать'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Модальное окно успешного создания */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ссылка успешно создана!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {formData.school_num} {formData.class}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm font-mono select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedLink)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    title="Копировать ссылку"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className="p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                    <QRCodeSVG
                      value={generatedLink}
                      size={300}
                      level="H"
                      includeMargin
                      className="dark:invert"
                      style={{ width: '300px', height: '300px' }}
                    />
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      Отсканируйте для перехода
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => shareLink(generatedLink, formData.school_num, formData.class)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                  >
                    Поделиться
                  </button>
                  <button
                    onClick={() => setIsSuccessModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksPage; 