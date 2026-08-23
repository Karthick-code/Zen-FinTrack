import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zen_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('zen_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
        } catch (e) {
          console.warn('Session expired or invalid:', e);
          localStorage.removeItem('zen_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('zen_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await authApi.register(name, email, password, confirmPassword);
    localStorage.setItem('zen_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('zen_token');
    setToken(null);
    setUser(null);
  };

  const quickLoginAsDemoUser = async () => {
    await login(import.meta.env.VITE_USER_EMAIL, import.meta.env.VITE_USER_PASS);
  };

  const quickLoginAsAdmin = async () => {
    await login(import.meta.env.VITE_ADMIN_EMAIL, import.meta.env.VITE_ADMIN_PASS);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickLoginAsDemoUser,
        quickLoginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
