import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

function ButtonContext() {
  // Берем тему из Context
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   const savedIsDark = savedTheme ? JSON.parse(savedTheme) : isDark;

  //   // Применяем тему к body
  //   document.body.style.background = savedIsDark ? '#333' : '#fff';
  //   document.body.style.color = savedIsDark ? '#fff' : '#333';
  //   document.body.style.transition = 'all 0.3s ease';
  // }, [isDark]); // Зависимость от isDark



  return (
    <button
      onClick={toggleTheme} // При клике меняем тему
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '25px',
        background: isDark ? '#696767ff' : '#2c2b2bff', // Меняем цвет кнопки
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      {isDark ? '🌞 Светлая тема' : '🎃 Темная тема'}
    </button>
  );
}

export default ButtonContext;