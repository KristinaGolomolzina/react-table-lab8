import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from "../Container";
import ButtonContext from "../ButtonContext.js";
import { ThemeContext } from "../ThemeContext.js";
import { increment, decrement, reset } from "../Counter.js";

function Lab4() {
  //  Берем цвета темы из Context
  const { colors, isDark } = useContext(ThemeContext);
  // Redux - получаем состояние счетчика
  const count = useSelector((state) => state.counter.value);
  //  Redux - получаем dispatch для отправки actions
  const dispatch = useDispatch();

  return (
    // Применяем цвета ко всей странице
    <div style={{
      background: colors.background,
      color: colors.text,
      minHeight: '100vh',
      padding: '20px',
      transition: 'all 1s ease' // плавная анимация
    }}>
      <Container>
        <h1>Лабораторная работа 4</h1>
        <h2>Изучение Context API - Смена темы</h2>

        {/* Кнопка переключения темы */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <ButtonContext />
        </div>

        {/* Блок который меняет цвет в зависимости от темы */}
        <div style={{
          padding: '30px',
          background: colors.primary,
          color: 'white',
          borderRadius: '10px',
          margin: '20px 0',
          textAlign: 'center'
        }}>

          <p>Этот блок использует цвет primary из текущей темы</p>
          <p>Текущая тема: <strong>{isDark ? 'Темная' : 'Светлая'}</strong></p>
        </div>

        {/* блок для счетчика */}
         <div style={{
          padding: '30px',
          background: colors.primary,
          color: 'white',
          borderRadius: '10px',
          margin: '20px 0',
          textAlign: 'center',
        }}>
          <h3>Redux Счетчик</h3>

          {/* Отображение счетчика */}
          <div style={{
            fontSize: '48px', 
            color: 'white',
            margin: '20px 0'
          }}>
            {count}
          </div>

          {/* Кнопки управления счетчиком */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            margin: '20px 0'
          }}>
            <button
              onClick={() => dispatch(decrement())}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              -1
            </button>

            <button
              onClick={() => dispatch(increment())}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              +1
            </button>

            <button
              onClick={() => dispatch(reset())}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Сброс
            </button>
          </div>  
        </div>

      </Container>
    </div>
  );
}

export default Lab4;