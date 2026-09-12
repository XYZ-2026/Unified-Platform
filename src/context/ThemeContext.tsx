'use client';

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always enforce clean light mode irrespective of OS / system theme
  useEffect(() => {
    try {
      localStorage.setItem('theme', 'light');
    } catch (e) {}
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        darkMode: false,
        toggleDarkMode: () => {},
        setDarkMode: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
