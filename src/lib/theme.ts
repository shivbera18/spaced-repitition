/**
 * Advanced Theme System for Forgetting Curve Tracker
 * Provides light/dark modes with beautiful color schemes and design tokens
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorPalette {
  // Primary brand colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  // Semantic colors
  success: {
    50: string;
    100: string;
    400: string;
    500: string;
    600: string;
    700: string;
    900: string;
  };
  
  warning: {
    50: string;
    100: string;
    400: string;
    500: string;
    600: string;
    700: string;
    900: string;
  };
  
  error: {
    50: string;
    100: string;
    400: string;
    500: string;
    600: string;
    700: string;
    900: string;
  };
  
  // Neutral grays
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

export interface ThemeTokens {
  colors: {
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Surface colors (cards, modals, etc.)
    surface: string;
    surfaceSecondary: string;
    surfaceHover: string;
    
    // Border colors
    border: string;
    borderSecondary: string;
    borderHover: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // Interactive colors
    primary: string;
    primaryHover: string;
    primaryPressed: string;
    
    // State colors
    success: string;
    successHover: string;
    warning: string;
    warningHover: string;
    error: string;
    errorHover: string;
    
    // Learning specific colors
    newItem: string;
    learningItem: string;
    reviewItem: string;
    masteredItem: string;
    
    // Difficulty colors
    difficultyEasy: string;
    difficultyMedium: string;
    difficultyHard: string;
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    card: string;
    modal: string;
  };
  
  blur: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
}

// Color palettes
const colors: ColorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fecaca',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d',
  },
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
};

// Light theme tokens
export const lightTheme: ThemeTokens = {
  colors: {
    background: colors.gray[50],
    backgroundSecondary: '#ffffff',
    backgroundTertiary: colors.gray[100],
    
    surface: '#ffffff',
    surfaceSecondary: colors.gray[50],
    surfaceHover: colors.gray[100],
    
    border: colors.gray[200],
    borderSecondary: colors.gray[300],
    borderHover: colors.gray[400],
    
    text: colors.gray[900],
    textSecondary: colors.gray[600],
    textTertiary: colors.gray[500],
    textInverse: '#ffffff',
    
    primary: colors.primary[600],
    primaryHover: colors.primary[700],
    primaryPressed: colors.primary[800],
    
    success: colors.success[600],
    successHover: colors.success[700],
    warning: colors.warning[600],
    warningHover: colors.warning[700],
    error: colors.error[600],
    errorHover: colors.error[700],
    
    newItem: colors.primary[100],
    learningItem: colors.warning[100],
    reviewItem: colors.success[100],
    masteredItem: colors.gray[100],
    
    difficultyEasy: colors.success[500],
    difficultyMedium: colors.warning[500],
    difficultyHard: colors.error[500],
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
};

// Dark theme tokens
export const darkTheme: ThemeTokens = {
  colors: {
    background: colors.gray[950],
    backgroundSecondary: colors.gray[900],
    backgroundTertiary: colors.gray[800],
    
    surface: colors.gray[900],
    surfaceSecondary: colors.gray[800],
    surfaceHover: colors.gray[700],
    
    border: colors.gray[700],
    borderSecondary: colors.gray[600],
    borderHover: colors.gray[500],
    
    text: colors.gray[50],
    textSecondary: colors.gray[300],
    textTertiary: colors.gray[400],
    textInverse: colors.gray[900],
    
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryPressed: colors.primary[200],
    
    success: colors.success[500],
    successHover: colors.success[600],
    warning: colors.warning[500],
    warningHover: colors.warning[600],
    error: colors.error[500],
    errorHover: colors.error[600],
    
    newItem: colors.primary[900],
    learningItem: colors.warning[900],
    reviewItem: colors.success[900],
    masteredItem: colors.gray[800],
    
    difficultyEasy: colors.success[400],
    difficultyMedium: colors.warning[400],
    difficultyHard: colors.error[400],
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    card: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    modal: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
  },
  
  blur: lightTheme.blur,
  borderRadius: lightTheme.borderRadius,
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
};

// Theme context and utilities
export class ThemeManager {
  private static currentTheme: ThemeMode = 'system';
  private static listeners: Array<(theme: ThemeTokens) => void> = [];
  
  static setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    const resolvedTheme = this.resolveTheme(theme);
    this.applyThemeToDOM(resolvedTheme);
    this.notifyListeners(resolvedTheme);
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', theme);
    }
  }
  
  static getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }
  
  static getResolvedTheme(): ThemeTokens {
    return this.resolveTheme(this.currentTheme);
  }
  
  static initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Load saved preference
    const saved = localStorage.getItem('theme-preference') as ThemeMode;
    if (saved) {
      this.currentTheme = saved;
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        const resolvedTheme = this.resolveTheme('system');
        this.applyThemeToDOM(resolvedTheme);
        this.notifyListeners(resolvedTheme);
      }
    });
    
    // Apply initial theme
    const initialTheme = this.resolveTheme(this.currentTheme);
    this.applyThemeToDOM(initialTheme);
  }
  
  static subscribe(listener: (theme: ThemeTokens) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private static resolveTheme(theme: ThemeMode): ThemeTokens {
    if (theme === 'light') return lightTheme;
    if (theme === 'dark') return darkTheme;
    
    // System theme
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? darkTheme : lightTheme;
    }
    
    return lightTheme; // Default fallback
  }
  
  private static applyThemeToDOM(theme: ThemeTokens): void {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    // Apply theme class
    const isDark = theme === darkTheme;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
  }
  
  private static notifyListeners(theme: ThemeTokens): void {
    this.listeners.forEach(listener => listener(theme));
  }
}

// Utility functions for theme-aware styling
export const getThemeValue = (key: keyof ThemeTokens['colors']): string => {
  return `var(--color-${key})`;
};

export const createThemeAwareStyle = (lightValue: string, darkValue: string): string => {
  return `light:${lightValue} dark:${darkValue}`;
};

// Export theme presets
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
