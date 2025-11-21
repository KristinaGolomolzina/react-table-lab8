import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { ThemeContext } from './ThemeContext';
import UserProfile from './UserProfile'
import { useApi } from '../hooks/useApi'; // 8. хук для получения данных пользователя

function Navigation({ isLoggedIn, onLogout, onMenuToggle }) {
  const location = useLocation()
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const { user } = useApi() // Получаем данные текущего пользователя
  
  console.log('🔍 Navigation - детальная информация о пользователе:', {
    user,
    isUserExist: !!user,
    userRole: user?.role,
    isAdmin: user?.role === 'admin',
    userData: user
  })

  if (!isLoggedIn) {
    return null;
  }

   return (
    <Navbar
      bg={isDark ? "dark" : "light"}
      variant={isDark ? "dark" : "light"}
      expand="lg"
      className="mb-3"
    >
      <Container>
        {/* Кнопка меню передает onMenuToggle*/}
        <Button
          variant="outline-secondary"
          onClick={onMenuToggle}
          className="me-2"
        >
          Меню
        </Button>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Моё приложение
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
       
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Навигация */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              Главная
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              active={location.pathname === '/about'}
            >
              О себе
            </Nav.Link>
            
            {/* 8. Ссылка на админ-панель только для администраторов */}
            {user && user.role === 'admin' && (
              <Nav.Link
                as={Link}
                to="/admin"
                active={location.pathname === '/admin'}
                style={{
                  color: '#dc3545',
                  fontWeight: 'bold'
                }}
              >
                ⚙️ Админ-панель
              </Nav.Link>
            )}
          </Nav>

          {/* Переключатель темы и профиль */}
          <Nav className="align-items-center">
            <Form.Check
              type="switch"
              id="theme-switch"
              label={isDark ? "🌙" : "☀️"}
              checked={isDark}
              onChange={toggleTheme}
              className="me-3"
            />
           
            <UserProfile onLogout={onLogout} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation