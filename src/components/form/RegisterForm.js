import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { useApi } from '../../hooks/useApi';
import './Forms.css'; // Импортируем CSS

const RegisterForm = () => {
  const { colors } = useContext(ThemeContext);
  const { register: registerUser, loading, error, clearApiError } = useApi(); // Используем хук API
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log('Данные регистрации:', data);
    
    // Очищаем предыдущие ошибки
    clearApiError();

    try {
      // Отправляем данные через Redux
      const result = await registerUser({
        username: data.name, // Преобразуем name в username для API
        password: data.password
      });

      if (result.payload?.success) {
        alert(`Регистрация успешна! Добро пожаловать, ${data.name}!`);
        reset();
      } else {
        // Ошибка обрабатывается в состоянии Redux
        console.error('Ошибка при регистрации:', result.payload?.error);
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">Регистрация</h3>

        {/* Показываем ошибки API */}
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
        
        {/* Поле имени */}
        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input 
            type="text" 
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register("name", { 
              required: "Введите ваше имя",
              minLength: {
                value: 2,
                message: "Имя должно содержать минимум 2 символа"
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Имя пользователя может содержать только буквы, цифры и подчеркивания"
              }
            })} 
            placeholder="Введите имя пользователя"
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
                value: 3, // Уменьшил для тестирования, можно вернуть 6
                message: "Пароль должен содержать минимум 3 символа"
              }
            })} 
            placeholder="Введите пароль"
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        {/* Подтверждение пароля */}
        <div className="form-group">
          <label className="form-label">Подтвердите пароль</label>
          <input 
            type="password" 
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            {...register("confirmPassword", { 
              required: "Подтвердите пароль",
              validate: value => value === password || "Пароли не совпадают"
            })} 
            placeholder="Повторите пароль"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
        </div>

        {/* Кнопка отправки */}
        <button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="submit-button"
          style={{ backgroundColor: colors.primary }}
        >
          {(isSubmitting || loading) ? 'Регистрируем...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;