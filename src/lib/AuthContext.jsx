import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, setCurrentUser } from './gamingCenterStore.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [authChecked, setAuthChecked] = useState(true);

  const checkUserAuth = useCallback(() => {
    setUser(getCurrentUser());
    setAuthChecked(true);
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.assign('/login');
  }, []);

  const login = useCallback((username, password) => {
    const nextUser = loginUser(username, password);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback((username, password) => {
    const nextUser = registerUser(username, password);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
    window.location.assign('/login');
  }, []);

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener('nexus-auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('nexus-auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      isAuthenticated: Boolean(user),
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authChecked,
      authError: null,
      checkUserAuth,
      navigateToLogin,
      login,
      register,
      logout,
    }),
    [authChecked, checkUserAuth, login, logout, navigateToLogin, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
