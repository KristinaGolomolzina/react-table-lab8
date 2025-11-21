import { useEffect, useState, useCallback, useContext } from "react"
import { useApi } from "../hooks/useApi"
import { ThemeContext } from "./ThemeContext" // 8
import "./FeedbackList.css"

const FeedbackList = ({readOnly = false}) => { // 8 readOnly = false
    const { 
        feedbacks, 
        loading, 
        error, 
        loadFeedbacks, 
        removeFeedback,
        user 
    } = useApi()
    
    const {colors} = useContext(ThemeContext) // 8
    const [isInitialized, setIsInitialized] = useState(false)

    // Используем useCallback для стабильной функции загрузки
    const loadData = useCallback(async () => {
        console.log("Начинаем загрузку отзывов...")
        try {
            await loadFeedbacks()
            console.log("Загрузка отзывов завершена")
        } catch (err) {
            console.error("Ошибка загрузки:", err)
        } finally {
            setIsInitialized(true)
            console.log("Инициализация завершена")
        }
    }, [loadFeedbacks])

    useEffect(() => {
        // Загружаем данные только если еще не инициализированы
        if (!isInitialized) {
            loadData()
        }
    }, [isInitialized, loadData]) // Добавляем loadData в зависимости

    if (loading && !isInitialized) {
        return (
            <div className="feedback-list loading">
                <p>Загрузка отзывов...</p>
            </div>
        )
    }

    // Ошибка
    if (error) {
        return (
            <div className="feedback-list error">
                <p>Ошибка при загрузке отзывов</p>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                    {error}
                </div>
            </div>
        )
    }

    // Если отзывов нет
    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="feedback-list empty">
                <p>Пока нет отзывов:(</p>
            </div>
        )
    }

    // Функция удаления отзыва
    const handleDelete = async (id) => {
        if (window.confirm('Удалить этот отзыв?')) {
            await removeFeedback(id);
            // Перезагружаем список
            loadData();
        }
    }

    // 8 показываем только активные в режиме только чтения
    const displayFeedbacks = readOnly ? feedbacks.filter(feedback => feedback.isActive !== false) : feedbacks

    return (
       <div className="feedback-list" style={{ color: colors.text }}>
            <div>
                <h3 className="feedback-title">
                    {readOnly ? 'Отзывы пользователей' : 'Управление отзывами'} ({displayFeedbacks.length})
                    {user && !readOnly && (
                        <span style={{
                            fontSize: '14px',
                            color: '#666',
                            marginLeft: '10px',
                            fontWeight: 'normal'
                        }}>
                            (Вы вошли как: {user.username})
                        </span>
                    )}
                </h3>
                
                {readOnly && displayFeedbacks.length === 0 && (
                    <p style={{ textAlign: 'center', color: colors.text + 'CC' }}>
                        Пока никто не оставил отзывов. Будьте первым!
                    </p>
                )}
            </div>
            
            {displayFeedbacks.map(feedback => (
                <div 
                    key={feedback.id} 
                    className="feedback-item"
                    style={{
                        border: `1px solid ${colors.text}20`,
                        backgroundColor: colors.background
                    }}
                >
                    <div className="feedback-header">
                        <div className="feedback-user-info">
                            <strong className="feedback-name" style={{ color: colors.text }}>
                                {feedback.name}
                            </strong>
                        </div>
                        
                        {/* Кнопки действий показываем только если НЕ readOnly и пользователь админ */}
                        {!readOnly && user?.role === 'admin' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {/* Кнопка удаления */}
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(feedback.id)}
                                    title="Удалить отзыв"
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    🗑️ Удалить
                                </button>
                                
                                {/* Кнопка блокировки/разблокировки */}
                                <button
                                    onClick={() => {
                                        // Здесь можно добавить функционал блокировки отзывов
                                        // показываем информационное сообщение
                                        alert('Функция блокировки отзывов будет реализована в следующем обновлении');
                                    }}
                                    title="Заблокировать отзыв"
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#ffc107',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    🚫 Заблокировать
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div 
                        className="feedback-date"
                        style={{ color: colors.text + 'CC' }}
                    >
                        Дата: {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                        {feedback.isActive === false && (
                            <span style={{ 
                                color: '#dc3545', 
                                marginLeft: '10px',
                                fontWeight: 'bold'
                            }}>
                                [ЗАБЛОКИРОВАН]
                            </span>
                        )}
                    </div>
                    
                    <div 
                        className="feedback-message"
                        // style={{ color: colors.text }}
                    >
                        {feedback.message}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FeedbackList;