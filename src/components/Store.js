import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Counter';

// Создаем store
export const store = configureStore({
  reducer: {
    counter: counterReducer, // Регистрируем текущее состояние счетчика
  },
});
