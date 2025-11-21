import { Link } from 'react-router-dom'; // Добавляем Link
import { Offcanvas, ListGroup, Button} from 'react-bootstrap'; // Выдвигающаяся панель,  Контейнер для списка элементов
import { useContext } from 'react'; // для темы
import { ThemeContext } from './ThemeContext';
// import './Menu.css'
// import Button from './Button';

function Menu({ isMenuOpen, setIsMenuOpen }) { 
    const labs = [
        { id: 'lab1', title: 'Лаб 1: Hello World', path: '/lab1' },
        { id: 'lab2', title: 'Лаб 2: Основы React. Работа с объектами JS', path: '/lab2' },
        { id: 'lab4', title: 'Лаб 4: Хуки React. Работа с Redux. Работа с роутингом.', path: '/lab4' },
        { id: 'lab5', title: 'Лаб 5: Хуки React. Работа с Redux. Формы', path: '/lab5' }
    ];

    //захотелось менять тему меню
    const {isDark} = useContext(ThemeContext)

    //убрали const openMenu
    // Функция для закрытия меню при клике на ссылку
    const closeMenu = () => { setIsMenuOpen(false) }

    return (
         <Offcanvas show={isMenuOpen} onHide={closeMenu} placement="start"
         data-bs-theme={isDark ? "dark" : "light"}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Лабораторные работы</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <ListGroup variant="flush"> 
                    {labs.map((lab) => (
                        <ListGroup.Item
                            key={lab.id}
                            action
                            as={Link}
                            to={lab.path}
                            onClick={closeMenu}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <span className="me-2">{lab.title}</span>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                title='Открыть в новой вкладке'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(lab.path, '_blank');
                                }}
                            >
                                📄
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default Menu;