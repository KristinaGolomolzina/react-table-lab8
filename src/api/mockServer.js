// Простой mock REST API сервер на основе localStorage
// Имитирует реальный бэкенд с задержками

// import { isAction } from "@reduxjs/toolkit";

const api_delay = 500;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const storage_keys = {
    users: 'api_users',
    feedbacks: 'api_feedbacks',
    profiles: 'api_profiles'
}

// Инициализация данных при первом запуске
const initializeData = () => {
    const existingUsers = localStorage.getItem(storage_keys.users);
    
    if (!existingUsers) {
        //8 создаем пользователей с ролями
        localStorage.setItem(storage_keys.users, JSON.stringify([
            { 
                id: 1, 
                username: 'admin', 
                password: 'admin',
                role: 'admin',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            { 
                id: 2, 
                username: 'user', 
                password: 'user',
                role: 'user', 
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ]))
    } else {
        // 8 Обновляем существующих пользователей - добавляем роль если отсутствует
        const users = JSON.parse(existingUsers);
        let needsUpdate = false;
        
        const updatedUsers = users.map(user => {
            if (!user.role) {
                needsUpdate = true;
                // Назначаем роль 'admin' для пользователя admin, для остальных 'user'
                return {
                    ...user,
                    role: user.username === 'admin' ? 'admin' : 'user'
                }
            }
            return user;
        })
        
        if (needsUpdate) {
            console.log('...обавляем роли...');
            localStorage.setItem(storage_keys.users, JSON.stringify(updatedUsers));
        }
    }

    if (!localStorage.getItem(storage_keys.feedbacks)) {
        localStorage.setItem(storage_keys.feedbacks, JSON.stringify([]))
    }

    if (!localStorage.getItem(storage_keys.profiles)) {
        localStorage.setItem(storage_keys.profiles, JSON.stringify([]))
    }
}

// Получить данные из localStorage
const getData = (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
}

// Сохранить данные в localStorage
const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

// MockAPI методы
const mockAPI = {
    //  для получения всех отзывов
    getFeedback: async function () {
        await delay(api_delay)
        initializeData() // Всегда инициализируем при запросе
        const feedbacks = getData(storage_keys.feedbacks)
        return { success: true, data: feedbacks }
    },

    //  добавить новый отзыв
    addFeedback: async function (feedbackData) {
        await delay(api_delay)
        initializeData()
        const feedbacks = getData(storage_keys.feedbacks)
        const newFeedback = {
            id: Date.now(),
            ...feedbackData,
            createdAt: new Date().toISOString(),
            isActive: true
        }
        feedbacks.push(newFeedback)
        setData(storage_keys.feedbacks, feedbacks)
        return { success: true, data: newFeedback }
    },

    //  удалить отзыв
    deleteFeedback: async function (id) {
        await delay(api_delay)
        initializeData()
        const feedbacks = getData(storage_keys.feedbacks)
        const filteredFeedbacks = feedbacks.filter(feedback => feedback.id !== id)
        setData(storage_keys.feedbacks, filteredFeedbacks)
        return { success: true, message: 'Отзыв был удален.' }
    },

    // регистрация пользователя
    register: async function (userData) {
        await delay(api_delay)
        initializeData()
        const users = getData(storage_keys.users)
        
        // Проверяем, нет ли уже пользователя с таким username
        const existingUser = users.find(user => user.username === userData.username)
        if (existingUser) {
            return {
                success: false,
                error: 'Пользователь с таким именем уже существует'
            }
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            role: 'user', // 8 По умолчанию роль 'user'
            isActive: true,
            createdAt: new Date().toISOString()
        }

        users.push(newUser) // добавляем элемент в конец массива
        setData(storage_keys.users, users)
        return { success: true, data: newUser }
    },

    // авторизация пользователя
    login: async function (credentials) {
        await delay(api_delay)
        initializeData() // Важно: всегда инициализируем перед поиском
        const users = getData(storage_keys.users)
        
        console.log('Поиск пользователя:', credentials)
        console.log('Все пользователи в системе:', users)

        //8 Ищем пользователя по 
        const user = users.find(u =>
            u.username === credentials.username && 
            u.password === credentials.password &&
            u.isActive !== false
        )
        console.log('Найденный пользователь:', user)

        if (!user) {
            console.log('Пользователь не найден или заблокирован :(')
            return {
                success: false,
                error: 'Неверное имя пользователя или пароль!'
            }
        }

        // 82 Проверяем не заблокирован ли пользователь
        if (user.isActive === false) {
            return {
                success: false,
                error: 'Пользователь заблокирован!'
            }
        }

        console.log('Успешный вход для пользователя:', user.username, 'роль:', user.role)
        
        return {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                role: user.role 
            }
        }
    },

    // 82 получить всех пользователей (только для админов)
    getUsers: async function () {
        await delay(api_delay)
        initializeData()
        const users = getData(storage_keys.users)
        
        // Возвращаем пользователей без паролей для безопасности
        const usersWithoutPasswords = users.map(({ password, ...user }) => user)
        
        return { success: true, data: usersWithoutPasswords }
    },

    // 82 обновить пользователя (блокировка/разблокировка)
    updateUser: async function (userId, userData) {
        await delay(api_delay)
        initializeData()
        const users = getData(storage_keys.users)
        const userIndex = users.findIndex(user => user.id === userId)
        
        if (userIndex === -1) {
            return {
                success: false,
                error: 'Пользователь не найден'
            }
        }

        // Обновляем данные пользователя
        users[userIndex] = {
            ...users[userIndex],
            ...userData,
            updatedAt: new Date().toISOString()
        }

        setData(storage_keys.users, users)
        
        // Возвращаем пользователя без пароля
        const { password, ...userWithoutPassword } = users[userIndex]
        return { success: true, data: userWithoutPassword }
    },

    // удалить пользователя
    deleteUser: async function (userId) {
        await delay(api_delay)
        initializeData()
        const users = getData(storage_keys.users)
        const filteredUsers = users.filter(user => user.id !== userId)
        setData(storage_keys.users, filteredUsers)
        return { success: true, message: 'Пользователь был удален.' }
    },

    // обновить профиль пользователя
    updateProfile: async function (userId, profileData) {
        await delay(api_delay)
        initializeData()
        const profiles = getData(storage_keys.profiles)
        const existingProfileIndex = profiles.findIndex(p => p.userId === userId)

        if (existingProfileIndex !== -1) {
            // Обновляем существующий профиль
            profiles[existingProfileIndex] = {
                ...profiles[existingProfileIndex],
                ...profileData,
                updatedAt: new Date().toISOString()
            }
        } else {
            // Создаем новый профиль
            profiles.push({
                id: Date.now(),
                userId,
                ...profileData,
                createdAt: new Date().toISOString()
            })
        }

        // сохраняем данные
        setData(storage_keys.profiles, profiles)
        return {
            success: true,
            data: profiles.find(p => p.userId === userId) // возвращает первый совпавший элемент
        }
    },

    getProfile: async function (userId) {
        await delay(api_delay);
        initializeData()
        const profiles = getData(storage_keys.profiles);
        const profile = profiles.find(p => p.userId === userId);
        return {
            success: true,
            data: profile || null
        }
    }
}

export default mockAPI