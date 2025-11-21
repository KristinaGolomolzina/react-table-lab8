import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { useApi } from '../../hooks/useApi';
import './Forms.css';

const LoginForm = ({ onLogin }) => {
  const { colors } = useContext(ThemeContext)
  const { login, loading, error, clearApiError } = useApi()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm()

  const onSubmit = async (data) => {
    console.log('Данные входа:', data)
    // Очищаем предыдущие ошибки
    clearApiError();
    try {
      const result = await login({
        username: data.name, // Преобразуем name в username для API
        password: data.password
      })

      console.log('Результат входа:', result);
      if (result.payload?.success) {
        alert('Вход выполнен успешно!');
        reset();
        console.log('Вызываем onLogin...')

        // 8 проверяем, существует ли onLogin перед вызовом
        if (onLogin && typeof onLogin === 'function') {
          onLogin(); // Просто вызываем без параметров
        } else {
          console.log('onLogin не предоставлен');
          window.location.reload(); // обновить страницу
        }
      } else {
        // Устанавливаем ошибку формы
        setError('root', {
          type: 'manual',
          message:'Ошибка при входе'
        })
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      setError('root', {
        type: 'manual',
        message: 'Произошла ошибка при подключении к серверу'
      })
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">Вход в систему</h3>

        {/*  для тестирования */}
        <div style={{
          background: '#e7f3ff',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          fontSize: '14px',
          color: '#0066cc'
        }}>
          Имя пользователя: admin
          <br />
          Пароль: admin
        </div>

        {/* ошибки API */}
        {error && (
          <div className="error-message" style={{
            marginBottom: '15px',
            padding: '10px',
            background: '#ffe6e6',
            border: '1px solid #ff4444',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        {/* ошибки формы */}
        {errors.root && (
          <div className="error-message" style={{
            marginBottom: '15px',
            padding: '10px',
            background: '#ffe6e6',
            border: '1px solid #ff4444',
            borderRadius: '4px'
          }}>
            {errors.root.message}
          </div>
        )}

        {/* Поле имени пользователя */}
        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register("name", {
              required: "Введите имя пользователя",
              minLength: {
                value: 2,
                message: "Имя должно содержать минимум 2 символа"
              }
            })}
            placeholder="Введите имя пользователя"
            defaultValue="admin" // Для тестирования
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        {/* Поле пароля */}
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            {...register("password", {
              required: "Введите пароль",
              minLength: {
                value: 3,
                message: "Пароль должен содержать минимум 3 символа"
              }
            })}
            placeholder="Введите пароль"
            defaultValue="admin" // Для тестирования
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        {/* Чекбокс "Запомнить меня" */}
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="remember"
            className="checkbox-input"
            {...register("rememberMe")}
          />
          <label htmlFor="remember" className="checkbox-label">Запомнить меня</label>
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="submit-button"
          style={{ backgroundColor: colors.primary }}
        >
          {(isSubmitting || loading) ? 'Входим...' : 'Войти'}
        </button>

      </form>
    </div>
  )
}

export default LoginForm;