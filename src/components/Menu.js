import { Link } from 'react-router-dom'; // Добавляем Link
import './Menu.css'
import Button from './Button';

function Menu({ isMenuOpen, setIsMenuOpen }) { // Убираем currentPage, setCurrentPage
    const labs = [
        { id: 'lab1', title: 'Лаб 1: Hello World', path: '/lab1' },
        { id: 'lab2', title: 'Лаб 2: Основы React. Работа с объектами JS', path: '/lab2' },
        { id: 'lab4', title: 'Лаб 4: Хуки React. Работа с Redux. Работа с роутингом. Формы', path: '/lab4' }
    ];

    const openMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Функция для закрытия меню при клике на ссылку
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const sidebarClass = isMenuOpen ? "sidebar sidebar-open" : "sidebar sidebar-closed";

    return (
        <div>
            <Button onClick={openMenu}>
                открыть
            </Button>

            <div className={sidebarClass}>
                <div className="sidebar-header">
                    <h2>Меню</h2>
                    <Button onClick={openMenu}> закрыть </Button>
                </div>

                <nav className="sidebar-nav">
                    {labs.map(lab => (
                        <div key={lab.id} className="sidebar-item">
                            <Link
                                to={lab.path}
                                className="sidebar-item"
                                onClick={closeMenu}
                            >
                                <span className="sidebar-text">{lab.title}</span>
                            </Link>
                            <button
                                className="sidebar-item"
                                onClick={() => window.open(lab.path, '_blank')}
                            >
                                Открыть в новой вкладке
                            </button>
                        </div>
                    ))}
                </nav>
            </div>

            {isMenuOpen && <div className="menu-overlay" onClick={openMenu}></div>}
        </div>
    );
}

export default Menu;