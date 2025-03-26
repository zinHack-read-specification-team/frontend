import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Настройка базового URL для axios
const api = axios.create({
  baseURL: 'https://zin-hack-25.antalkon.ru/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface FormData {
  phone_number: string;
  email_adress: string;
  password: string;
  name: string;
}

interface FormErrors {
  phone_number?: string;
  email_adress?: string;
  password?: string;
  name?: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    phone_number: '',
    email_adress: '',
    password: '',
    name: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Валидация имени (3-50 символов)
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Имя должно содержать минимум 3 символа';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Имя не должно превышать 50 символов';
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email_adress.trim()) {
      newErrors.email_adress = 'Email обязателен';
    } else if (!emailRegex.test(formData.email_adress)) {
      newErrors.email_adress = 'Некорректный email адрес';
    }

    // Валидация телефона (формат E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Номер телефона обязателен';
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Формат: +7XXXXXXXXXX (международный формат)';
    }

    // Валидация пароля (минимальные требования безопасности)
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Требуется минимум 1 заглавная буква, 1 строчная буква и 1 цифра';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/sign-up', formData);
      setNotification({
        type: 'success',
        message: 'Регистрация успешно завершена!'
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Произошла ошибка при регистрации'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Регистрация преподавателя
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Создайте аккаунт для доступа к системе
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 space-y-6">
          {/* Имя */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent`}
              placeholder="Введите ваше имя (от 3 до 50 символов)"
              minLength={3}
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email_adress" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email_adress"
              name="email_adress"
              value={formData.email_adress}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email_adress 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent`}
              placeholder="example@email.com"
            />
            {errors.email_adress && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email_adress}</p>
            )}
          </div>

          {/* Телефон */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Номер телефона
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.phone_number 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent`}
              placeholder="+7XXXXXXXXXX"
              pattern="\+[1-9]\d{1,14}"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phone_number}</p>
            )}
          </div>

          {/* Пароль */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-accent-light dark:bg-accent-dark text-white rounded-lg 
                     hover:bg-accent-light/90 dark:hover:bg-accent-dark/90 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light 
                     dark:focus:ring-accent-dark transition-colors duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>

      {/* Уведомление */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          } transition-all duration-500 ease-in-out`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage; 