import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authChecked, setAuthChecked] = useState(true);

  const checkUserAuth = useCallback(() => {
    setAuthChecked(true);
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.assign('/login');
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: true,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authChecked,
      authError: null,
      checkUserAuth,
      navigateToLogin,
    }),
    [authChecked, checkUserAuth, navigateToLogin]
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
