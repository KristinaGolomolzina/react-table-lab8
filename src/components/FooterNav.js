import { useState, useContext } from "react";
import { Navbar, Nav, Modal, Container } from "react-bootstrap";
import { ThemeContext } from "./ThemeContext";
import FeedbackForm from "./form/FeedbackForm";

const FooterNav = () => {
    const [feedbackShow, setFeedbackShow] = useState(false)
    const [supportShow, setSupportShow] = useState(false)

    const { isDark } = useContext(ThemeContext)

    return (
        <>
            {/*нижняя панель */}
            <Navbar
                bg={isDark ? "dark" : "light"}
                variant={isDark ? "dark" : "light"}
                // fixed="bottom" 
                className="border-top shadow-sm"
            >
                <Container className="justify-content-center">
                    <Nav>
                        <Nav.Link
                            onClick={() => setFeedbackShow(true)}
                            className="text-center"
                        >
                            <div style={{ fontSize: '24px' }}>💬</div>
                            <small>Обратная связь</small>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => setSupportShow(true)}
                            className="text-center"
                        >
                            <div style={{ fontSize: '24px' }}>🛠️</div>
                            <small>Поддержка</small>
                        </Nav.Link>

                    </Nav>
                </Container>
            </Navbar>

            <footer className={`py-3 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'} border-top`}>
                <Container>
                    <p className="text-center mb-0 small">Сайт 2025 год.</p>
                </Container>
            </footer>

            {/* Модальное окно обратной связи */}
            <Modal show={feedbackShow} onHide={() => setFeedbackShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Обратная связь</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FeedbackForm onSuccess={() => setFeedbackShow(false)} />
                </Modal.Body>
            </Modal>

            {/* Модальное окно поддержки */}
            <Modal show={supportShow} onHide={() => setSupportShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Поддержка</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li>📧 Email: support@mail.com</li>
                        <li>📞 Телефон: +7 (999) 123-45-67</li>
                        <li>🕒 Время работы: 9:00 - 18:00</li>
                    </ul>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FooterNav