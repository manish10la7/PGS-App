import React, { createContext, useState, useMemo } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = useMemo(() => ({
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#000000',
    textColor: theme === 'light' ? '#000000' : '#FFFFFF',
    // Add other theme-dependent styles here
  }), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};
