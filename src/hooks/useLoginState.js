import { useCallback } from "react";
import { useState, useEffect } from "react";

// Кастомный хук для управления статусом авторизации
const useLoginState = () =>{
    // Получаем статус авторизации из localStorage или устанавливаем false по умолчанию
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const saved = localStorage.getItem('isLoggedIn')
        console.log('useLoginState инициализация из localStorage:', saved)
        
        // проверка всех возможных значений
        if (saved === 'true') return true
        if (saved === 'false') return false
        return false // значение по умолчанию
    })

    // Сохраняем статус в localStorage при изменении
    useEffect(() => {
        console.log('useLoginState сохранение в localStorage:', isLoggedIn)
        localStorage.setItem('isLoggedIn', isLoggedIn.toString())
    }, [isLoggedIn])

    // Функция входа - useCallback чтобы не пересоздавалась при каждом рендере
   const login = useCallback(() => {
        console.log('useLoginState.login() ВЫЗВАН')
        setIsLoggedIn(true)
    }, [])

    // Функция выхода - useCallback чтобы не пересоздавалась при каждом рендере
   const logout = useCallback(() => {
        console.log('useLoginState.logout() ВЫЗВАН')
        setIsLoggedIn(false)
    }, [])

    // Возвращаем статус и функции для управления
    return{
        isLoggedIn,
        login,
        logout
    }
}

export default useLoginState