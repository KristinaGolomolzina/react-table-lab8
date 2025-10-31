import Navigation from "./Navigation";
import './Pattern.css'
import Menu from "./Menu.js";
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // Добавляем импорты
import HomePage from './sections/Homelist.js';
import AboutPage from './sections/AboutPage.js';
import Lab1 from './sections/Lab1.js';
import Lab2 from './sections/Lab2.js';
import Lab4 from './sections/Lab4.js';

function Pattern() { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`pattern ${isMenuOpen ? 'menu-open' : ''}`}> 
      <header>
        <Navigation />
      </header>

      <Menu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Основное содержимое страницы - заменяем children на Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lab1" element={<Lab1 />} />
          <Route path="/lab2" element={<Lab2 />} />
          <Route path="/lab4" element={<Lab4 />} />
        </Routes>
      </main>

      {/* Подвал сайта */}
      <footer className="footer">
        <p>Сайт 2025 год.</p>
      </footer>
    </div>
  );
}

export default Pattern;