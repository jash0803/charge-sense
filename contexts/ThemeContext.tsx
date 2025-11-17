'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTimeBasedTheme } from '@/lib/mockData';

type ThemeMode = 'night' | 'morning' | 'day' | 'evening' | 'auto';

interface ThemeContextType {
  theme: 'night' | 'morning' | 'day' | 'evening';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [currentTheme, setCurrentTheme] = useState<'night' | 'morning' | 'day' | 'evening'>('day');

  useEffect(() => {
    if (themeMode === 'auto') {
      // Update theme based on time
      const updateTheme = () => {
        setCurrentTheme(getTimeBasedTheme());
      };
      
      updateTheme();
      const interval = setInterval(updateTheme, 60000); // Update every minute
      
      return () => clearInterval(interval);
    } else {
      // Use manual theme
      setCurrentTheme(themeMode);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeMode, setThemeMode }}>
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


