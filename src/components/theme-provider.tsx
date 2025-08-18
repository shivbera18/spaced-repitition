'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeManager, ThemeMode, ThemeTokens, lightTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: ThemeTokens;
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<ThemeTokens>(lightTheme);

  useEffect(() => {
    // Initialize theme manager
    ThemeManager.initialize();
    setMode(ThemeManager.getCurrentTheme());
    setTheme(ThemeManager.getResolvedTheme());

    // Subscribe to theme changes
    const unsubscribe = ThemeManager.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    return unsubscribe;
  }, []);

  const handleSetTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    ThemeManager.setTheme(newMode);
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    handleSetTheme(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
