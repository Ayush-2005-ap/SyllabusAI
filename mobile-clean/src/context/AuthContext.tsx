import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '../types/auth.types';
import api from '../services/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check auto-login on mount
    const checkUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setToken(storedToken);
            setUser(res.data.user);
          } else {
            await SecureStore.deleteItemAsync('token');
          }
        }
      } catch (err) {
        console.error('Auto login failed', err);
        await SecureStore.deleteItemAsync('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    try {
      await SecureStore.setItemAsync('token', newToken);
      setToken(newToken);
      setUser(newUser);
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
    } catch (err) {
      console.error('Error storing token', err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.Authorization;
    } catch (err) {
      console.error('Error removing token', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        logout,
        setLoading: setIsLoading,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
