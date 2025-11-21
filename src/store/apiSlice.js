import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mockAPI from '../api/mockServer';

//8 Восстанавливаем пользователя из localStorage при инициализации
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Ошибка при загрузке пользователя из localStorage:', error)
    return null
  }
}

// сохранение пользователя в localStorage
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
  }
}

// Async Thunks для работы с API
export const fetchFeedbacks = createAsyncThunk(
  'api/fetchFeedbacks',
  // _ (игнорируемый аргумент)
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAPI.getFeedback();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const addFeedback = createAsyncThunk(
  'api/addFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await mockAPI.addFeedback(feedbackData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const deleteFeedback = createAsyncThunk(
  'api/deleteFeedback',
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await mockAPI.deleteFeedback(feedbackId);
      return { ...response, id: feedbackId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const registerUser = createAsyncThunk(
  'api/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await mockAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const loginUser = createAsyncThunk(
  'api/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateProfile = createAsyncThunk(
  'api/updateProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await mockAPI.updateProfile(userId, profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const getProfile = createAsyncThunk(
  'api/getProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await mockAPI.getProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

//8. Функции для управления пользователями
export const fetchUsers = createAsyncThunk(
  'api/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAPI.getUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateUser = createAsyncThunk(
  'api/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await mockAPI.updateUser(userId, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const deleteUser = createAsyncThunk(
  'api/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await mockAPI.deleteUser(userId);
      return { ...response, id: userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// Создаем slice
const apiSlice = createSlice({
  name: 'api',
  initialState: {
    feedbacks: [],
    users: [], //8. список пользователей
    user: loadUserFromStorage(), // 8 восстанавливаем пользователя из localStorage
    profile: null,
    loading: false,
    error: null,
    success: false
  },

  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    },
    logout: (state) => {
      state.user = null
      state.profile = null
      saveUserToStorage(null) // Очищаем пользователя из localStorage
    },
    // 8 для восстановления сессии
    restoreSession: (state) => {
      const savedUser = loadUserFromStorage();
      if (savedUser) {
        state.user = savedUser;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false
        state.feedbacks = action.payload.data;
        state.success = true
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload;
      })
      // Add Feedback
      .addCase(addFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.feedbacks.push(action.payload.data);
        state.success = true
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.feedbacks = state.feedbacks.filter(feedback => feedback.id !== action.payload.id);
        state.success = true
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
        state.success = true
        saveUserToStorage(action.payload.data) // Сохраняем пользователя
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data;
        state.success = true
        saveUserToStorage(action.payload.data); // Сохраняем пользователя

        console.log('loginUser.fulfilled - сохранен пользователь:', action.payload.data)
        console.log('Роль пользователя:', action.payload.data?.role)

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //8. для управления пользователями
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.success = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        // Обновляем пользователя в списке
        const index = state.users.findIndex(user => user.id === action.payload.data.id)
        if (index !== -1) {
          state.users[index] = action.payload.data
        }
        state.success = true
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user.id !== action.payload.id);
        state.success = true
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
});

// Экспортируем actions и reducer
export const { clearError, clearSuccess, logout, restoreSession } = apiSlice.actions;
export default apiSlice.reducer;