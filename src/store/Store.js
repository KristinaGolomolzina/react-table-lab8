import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/Counter';
import apiReducer from './apiSlice'; 

// Создаем store
export const store = configureStore({
  reducer: {
    counter: counterReducer, // Регистрируем текущее состояние счетчика
    api: apiReducer,
  },
});
