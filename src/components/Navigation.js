import { Link, useLocation } from 'react-router-dom';
import './Navigation.css'

function Navigation() {
  const location = useLocation(); // Хук для получения текущего пути

  return (
    // nav используется для навигации
    <nav className="navigation">
      <h2>Моё приложение</h2>

      <div className="menu">
        <Link
          to="/"
          // Подсвечиваем если текущий путь = "/"
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Главная
        </Link>
        <Link
          to="/about"
          className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}
        >
          О нас
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;