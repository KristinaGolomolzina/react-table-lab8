import React, { createContext, useState, useEffect } from 'react';

// Место для хранения темы
export const ThemeContext = createContext();

// для раздачи темы всем компонентам
export const ThemeProvider = ({ children }) => {
  // Состояние для темы (false - день, true - ночь)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Сохраняем и применяем тему при изменении
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
    
    document.body.style.background = isDark ? darkColors.background : lightColors.background;
    document.body.style.color = isDark ? darkColors.text : lightColors.text;
    document.body.style.transition = 'all 0.3s ease';
  }, [isDark]);

  // Функция переключения темы
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = {
    isDark,          
    toggleTheme,      // функция переключения
    colors: isDark ? darkColors : lightColors  
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Цвета для светлой темы
const lightColors = {
  background: '#ffffff', 
  text: '#000000',      
  primary: '#ab37eeff'    
};

// Цвета для темной темы  
const darkColors = {
  background: '#1a1a1a', 
  text: '#ffffff',       
  primary: '#4a1e64ff'    
};