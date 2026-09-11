import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('campus_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campus_current_user_v3') || localStorage.getItem('campus_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(!user);

  // Validate session on mount once
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('campus_token');
      if (savedToken) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('campus_current_user_v3', JSON.stringify(res.user));
          } else if (!user) {
            logout();
          }
        } catch (err) {
          console.error('Session validation error:', err);
          if (!user) logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (!password) {
        return { success: false, message: 'Password is required' };
      }
      const res = await api.login(email, password);
      if (res.success && res.user) {
        const activeToken = res.token || 'session-' + Date.now();
        localStorage.setItem('campus_token', activeToken);
        localStorage.setItem('campus_current_user_v3', JSON.stringify(res.user));
        setToken(activeToken);
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
    sessionStorage.removeItem('campus_current_page');
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
