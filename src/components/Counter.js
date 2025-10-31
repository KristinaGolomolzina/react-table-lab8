import { createSlice } from "@reduxjs/toolkit";

// Создаем слайс для счетчика
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    // Action для увеличения счетчика
    increment: (state) => {
      state.value += 1;
    },
    // Action для уменьшения счетчика
    decrement: (state) => {
      state.value -= 1;
    },
    // Action для сброса счетчика
    reset: (state) => {
      state.value = 0;
    }
  }
});

// Экспортируем actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Экспортируем reducer
export default counterSlice.reducer;