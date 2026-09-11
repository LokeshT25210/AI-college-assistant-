import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campus_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Session validation error:', err);
          logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      if (!password) {
        return { success: false, message: 'Password is required' };
      }
      const res = await api.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('campus_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      } else {
        return { success: false, message: res.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Network or server error during login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_current_user_v3');
    localStorage.removeItem('campus_current_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
