import { DARK_COLOURS, LIGHT_COLOURS } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  colours: typeof LIGHT_COLOURS;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colours: LIGHT_COLOURS,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<Theme>(systemTheme);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    AsyncStorage.setItem('theme', next);
  };

  const colours = theme === 'light' ? LIGHT_COLOURS : DARK_COLOURS;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colours }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);