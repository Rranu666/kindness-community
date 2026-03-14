import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  // Kept for App.jsx compatibility — no public settings concept in Supabase
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState(null);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildUserProfile(session.user));
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildUserProfile(session.user));
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  function buildUserProfile(supabaseUser) {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      role: supabaseUser.user_metadata?.role || 'user',
      avatar_url: supabaseUser.user_metadata?.avatar_url || null,
      ...supabaseUser.user_metadata,
    };
  }

  const logout = (shouldRedirect = true) => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      if (shouldRedirect) {
        window.location.href = '/';
      }
    });
  };

  const navigateToLogin = () => {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
  };

  const checkAppState = async () => {
    setIsLoadingAuth(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(buildUserProfile(session.user));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoadingAuth(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
    }}>
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
