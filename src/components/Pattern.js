import "./Pattern.css";
import Menu from "./Menu.js";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./sections/Homelist.js";
import AboutPage from "./sections/AboutPage.js";
import Lab1 from "./sections/Lab1.js";
import Lab2 from "./sections/Lab2.js";
import Lab4 from "./sections/Lab4.js";
import Lab5 from "./sections/Lab5.js";
import Navigation from "./Navigation.js";
import FooterNav from "./FooterNav.js";
// import useLoginState from '../hooks/useLoginState.js';
import AdminPanel from "./sections/AdminPanel.js"; //8.
import { useApi } from "../hooks/useApi.js";

function Pattern({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isLoggedIn, logout } = useLoginState() // Получаем состояние авторизации
  const { user } = useApi(); // Получаем данные текущего пользователя

  // Функция для переключения меню
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`pattern d-flex flex-column min-vh-100 ${
        isMenuOpen ? "menu-open" : ""
      }`}
    >
      <Navigation
        isLoggedIn={true}
        onLogout={onLogout}
        onMenuToggle={handleMenuToggle}
      />

      <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Основное содержимое с исходными стилями + Bootstrap */}
      <main className="main-content flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lab1" element={<Lab1 />} />
          <Route path="/lab2" element={<Lab2 />} />
          <Route path="/lab4" element={<Lab4 />} />
          <Route path="/lab5" element={<Lab5 />} />
          {user && user.role === "admin" && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          {user && user.role !== "admin" && (
            <Route path="/admin" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </main>
      <FooterNav />
    </div>
  );
}

export default Pattern;
