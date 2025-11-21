import { useDispatch, useSelector } from 'react-redux' // useSelector — читает данные из хранилища useDispatch — отправляет экшены для изменения состояния
import {
  fetchFeedbacks,
  addFeedback,
  deleteFeedback,
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  fetchUsers, //8.
  updateUser, //8.
  deleteUser, //8.
  clearError, // 7 очистка состояния ошибки
  clearSuccess, //7  очистка состояния успеха
  logout,
  restoreSession // для восстановления сессии
} from '../store/apiSlice'

// хук для удобной работы с API
export const useApi = () => {
  const dispatch = useDispatch()
  const apiState = useSelector(state => state.api)
  console.log("useApi состояние:", {
    user: apiState.user,
    role: apiState.user?.role,
    isLoggedIn: !!apiState.user
  })

  return {
    // Состояние Redux‑хранилища (useSelector)
    ...apiState,
    // Методы для отзывов
    loadFeedbacks: () => dispatch(fetchFeedbacks()),
    createFeedback: (feedbackData) => dispatch(addFeedback(feedbackData)),
    removeFeedback: (feedbackId) => dispatch(deleteFeedback(feedbackId)),

    // Методы для авторизации
    register: (userData) => dispatch(registerUser(userData)),
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logout()),
    restoreSession:() => dispatch(restoreSession()), // 8

    // Методы для профиля
    updateUserProfile: (userId, profileData) =>
      dispatch(updateProfile({ userId, profileData })),
    loadProfile: (userId) => dispatch(getProfile(userId)),

    //8. Методы для управления пользователями
    loadUsers: () => dispatch(fetchUsers()),
    updateUser: (userId, userData) => dispatch(updateUser({ userId, userData })),
    removeUser: (userId) => dispatch(deleteUser(userId)),

    // Вспомогательные методы
    clearApiError: () => dispatch(clearError()),
    clearApiSuccess: () => dispatch(clearSuccess())
  }
}