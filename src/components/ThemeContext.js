import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
    if (isDark) {
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.body.classList.remove('bg-dark', 'text-light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  }

  const themeValue = {
    isDark,
    toggleTheme,
    colors: isDark ? darkColors : lightColors
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

const lightColors = {
  background: '#f8f8f8ff',
  text: '#000000',
  primary: '#b78affff' // Bootstrap primary color
}

const darkColors = {
  background: '#212529',
  text: '#ffffff', 
  primary: '#8462b9ff'
}