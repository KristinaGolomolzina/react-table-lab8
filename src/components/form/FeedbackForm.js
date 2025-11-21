import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import { useForm } from "react-hook-form"
import {useApi} from "../../hooks/useApi"
import "./Forms.css"

const FeedbackForm = () => {
  const { colors } = useContext(ThemeContext);
  const { createFeedback, loading, error, clearApiError } = useApi();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  // Функция отправки отзыва
  const onSubmit = async (data) => {
    console.log('Данные отзыва:', data);
    
    // Очищаем предыдущие ошибки
    clearApiError();
    
    try {
      // Отправляем отзыв через Redux
      const result = await createFeedback(data);
      
      console.log('Результат отправки отзыва:', result); // Для отладки
      
      // В Redux Toolkit данные находятся в result.payload
      if (result.payload?.success) {
        // Очищаем форму при успешной отправке
        reset();
        alert('Спасибо за ваш отзыв!');
      } else {
        // Ошибка обрабатывается в состоянии Redux
        const errorMsg = result.payload?.error || result.error || 'Неизвестная ошибка';
        console.error('Ошибка при отправке отзыва:', errorMsg);
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">Оставить отзыв</h3>
        
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
        
        {/* Имя пользователя */}
        <div className="form-group">
          <label className="form-label">Имя</label>
          <input 
            type="text" 
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register("name", { 
              required: "Пожалуйста, введите ваше имя",
              minLength: {
                value: 2,
                message: "Имя должно содержать минимум 2 символа"
              }
            })} 
            placeholder="Введите Ваше имя"
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        {/* Оценка */}
        <div className="form-group">
          <label className="form-label">Оценка</label>
          <select 
            className={`form-input ${errors.rating ? 'error' : ''}`}
            {...register("rating", { 
              required: "Пожалуйста, выберите оценку"
            })}
          >
            <option value="">Выберите оценку</option>
            <option value="5">Отлично (5)</option>
            <option value="4">Хорошо (4)</option>
            <option value="3">Удовлетворительно (3)</option>
            <option value="2">Плохо (2)</option>
            <option value="1">Очень плохо (1)</option>
          </select>
          {errors.rating && <span className="error-message">{errors.rating.message}</span>}
        </div>

        {/* Текст отзыва */}
        <div className="form-group">
          <label className="form-label">Ваш отзыв</label>
          <textarea 
            rows="4"
            className={`form-input ${errors.message ? 'error' : ''}`}
            {...register("message", { 
              required: "Пожалуйста, напишите ваш отзыв",
              minLength: {
                value: 10,
                message: "Отзыв должен содержать минимум 10 символов"
              },
              maxLength: {
                value: 500,
                message: "Отзыв не должен превышать 500 символов"
              }
            })} 
            placeholder="Что Вы думаете?"
          />
          {errors.message && <span className="error-message">{errors.message.message}</span>}
        </div>

        {/* Кнопка отправки */}
        <button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="submit-button"
          style={{ backgroundColor: colors.primary }}
        >
          {(isSubmitting || loading) ? 'Отправляем...' : 'Отправить отзыв'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
