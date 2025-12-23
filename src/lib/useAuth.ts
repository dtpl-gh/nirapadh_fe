import { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

// Fetcher function for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetcher('/user');
        setUserId(response.userId);
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userId, loading, error };
};
