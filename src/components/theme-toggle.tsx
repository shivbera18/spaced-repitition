'use client';

import React from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from './theme-provider';
import { ThemeMode } from '@/lib/theme';

const themeOptions = [
  { mode: 'light' as ThemeMode, icon: SunIcon, label: 'Light' },
  { mode: 'dark' as ThemeMode, icon: MoonIcon, label: 'Dark' },
  { mode: 'system' as ThemeMode, icon: ComputerDesktopIcon, label: 'System' },
];

export function ThemeToggle() {
  const { mode, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-surface border border-border rounded-lg p-1 shadow-sm">
      {themeOptions.map(({ mode: themeMode, icon: Icon, label }) => (
        <button
          key={themeMode}
          onClick={() => setTheme(themeMode)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
            ${mode === themeMode 
              ? 'bg-primary text-textInverse shadow-sm' 
              : 'text-textSecondary hover:text-text hover:bg-surfaceHover'
            }
          `}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

export function SimpleThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
        bg-surface hover:bg-surfaceHover border border-border shadow-sm
        text-textSecondary hover:text-text
      `}
      title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {mode === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
