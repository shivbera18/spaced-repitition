import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        // Background colors
        background: "var(--color-background)",
        backgroundSecondary: "var(--color-backgroundSecondary)",
        backgroundTertiary: "var(--color-backgroundTertiary)",
        
        // Surface colors
        surface: "var(--color-surface)",
        surfaceSecondary: "var(--color-surfaceSecondary)",
        surfaceHover: "var(--color-surfaceHover)",
        
        // Border colors
        border: "var(--color-border)",
        borderSecondary: "var(--color-borderSecondary)",
        borderHover: "var(--color-borderHover)",
        
        // Text colors
        text: "var(--color-text)",
        textSecondary: "var(--color-textSecondary)",
        textTertiary: "var(--color-textTertiary)",
        textInverse: "var(--color-textInverse)",
        
        // Interactive colors
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primaryHover)",
        primaryPressed: "var(--color-primaryPressed)",
        
        // State colors
        success: "var(--color-success)",
        successHover: "var(--color-successHover)",
        warning: "var(--color-warning)",
        warningHover: "var(--color-warningHover)",
        error: "var(--color-error)",
        errorHover: "var(--color-errorHover)",
        
        // Learning specific colors
        newItem: "var(--color-newItem)",
        learningItem: "var(--color-learningItem)",
        reviewItem: "var(--color-reviewItem)",
        masteredItem: "var(--color-masteredItem)",
        
        // Difficulty colors
        difficultyEasy: "var(--color-difficultyEasy)",
        difficultyMedium: "var(--color-difficultyMedium)",
        difficultyHard: "var(--color-difficultyHard)",
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'modal': 'var(--shadow-modal)',
      },
      backdropBlur: {
        'sm': 'var(--blur-sm)',
        'md': 'var(--blur-md)',
        'lg': 'var(--blur-lg)',
        'xl': 'var(--blur-xl)',
      }
    },
  },
  plugins: [],
};

export default config;
