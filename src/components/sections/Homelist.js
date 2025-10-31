import Container from "../Container.js";
import Button from "../Button.js";

function HomePage() {
    return (
        <div>
            <Container>
                <h1>Добро пожаловать!</h1>
                <p>Hello word!</p>
                <Button variant="first" onClick={() => alert('Привет!')}>
                    Начать знакомство
                </Button>
            </Container>
            <Container>
                <h2>React - JavaScript-библиотека с открытым исходным кодом</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3>Цель</h3>
                        <p>Создавать динамические интерактивные элементы на сайте</p>
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3>Принцип работы</h3>
                        <p>разбивать интерфейс на небольшие независимые блоки</p>
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3>Изоляция</h3>
                        <p>изменения в одном компоненте не затрагивают другие</p>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomePage;