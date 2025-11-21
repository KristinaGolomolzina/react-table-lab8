import { useState, useEffect, useCallback } from 'react';

// Кастомный хук для управления отзывами с сохранением в localStorage
const useFeedback =() =>{
    // Загружаем отзывы из localStorage при инициализации
  const [feedbacks, setFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('feedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [];
  })

  // Сохраняем отзывы в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks])

  // Функция добавления отзыва с useCallback
  const addFeedback = useCallback((newFeedback) => {
    setFeedbacks(prevFeedbacks => [newFeedback, ...prevFeedbacks]);
  }, [])

  // Функция удаления отзыва
  const deleteFeedback = useCallback((id) => {
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== id));
  }, [])

  // Функция очистки всех отзывов
  const clearFeedbacks = useCallback(() => {
    setFeedbacks([]);
  }, [])

  return {
    feedbacks,
    addFeedback,
    deleteFeedback,
    clearFeedbacks
  }
}

export default useFeedback