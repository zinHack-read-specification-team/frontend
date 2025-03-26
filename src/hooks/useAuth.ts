import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  phone_number: string;
  email_adress: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch('https://zin-hack-25.antalkon.ru/api/v1/data/get-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/teacher/auth/sign-in');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, isLoading, checkAuth, logout };
}; 