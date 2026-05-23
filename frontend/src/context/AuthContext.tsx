'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  savedCollegeIds: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleSaveCollege: (collegeId: string) => Promise<boolean>;
  refreshSavedColleges: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedCollegeIds, setSavedCollegeIds] = useState<string[]>([]);

  const fetchSavedColleges = async () => {
    try {
      const res = await api.getSavedColleges();
      if (res.status === 'success' && res.data?.colleges) {
        setSavedCollegeIds(res.data.colleges.map((c: any) => c.id));
      }
    } catch (err) {
      console.error('Failed to fetch saved colleges:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await api.getMe();
            if (res && res.status === 'success' && res.data?.user) {
              setUser(res.data.user);
              await fetchSavedColleges();
            } else {
              localStorage.removeItem('token');
            }
          } catch (err) {
            console.error('Session restore failed:', err);
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.status === 'success' && res.data) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        await fetchSavedColleges();
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password });
      if (res.status === 'success' && res.data) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        await fetchSavedColleges();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSavedCollegeIds([]);
  };

  const toggleSaveCollege = async (collegeId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('Please log in to save colleges');
    }

    const isSaved = savedCollegeIds.includes(collegeId);
    try {
      if (isSaved) {
        await api.unsaveCollege(collegeId);
        setSavedCollegeIds((prev) => prev.filter((id) => id !== collegeId));
        return false;
      } else {
        await api.saveCollege(collegeId);
        setSavedCollegeIds((prev) => [...prev, collegeId]);
        return true;
      }
    } catch (err) {
      console.error('Failed to toggle save college:', err);
      throw err;
    }
  };

  const refreshSavedColleges = async () => {
    if (user) {
      await fetchSavedColleges();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        savedCollegeIds,
        login,
        register,
        logout,
        toggleSaveCollege,
        refreshSavedColleges,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
