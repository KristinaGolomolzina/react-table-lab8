import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useApi } from "../hooks/useApi"; // 8. хук для получения данных пользователя

// в правом верхнем углу профиль пользователя с кнопкой разлогина
const UserProfile = ({ onLogout }) => {
    const { colors } = useContext(ThemeContext)
    const { user } = useApi() // 8 Получаем данные текущего пользователя

    return (
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Блок с информацией о пользователе */}
            <div className="user-info" style={{ textAlign: 'right' }}>
                {/* Аватар пользователя с индикатором роли */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        className="user-avatar"
                        style={{
                            backgroundColor: colors.primary,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            position: 'relative'
                        }}
                    >
                        {user?.username?.charAt(0).toUpperCase() || 'П'}
                        {/* Индикатор роли администратора */}
                        {user?.role === 'admin' && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Администратор"
                            >
                                A
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="user-name" style={{ fontWeight: 'bold' }}>
                            {user?.username || 'Пользователь'}
                        </div>
                        <div
                            className="user-role"
                            style={{
                                fontSize: '12px',
                                color: user?.role === 'admin' ? '#dc3545' : '#666'
                            }}
                        >
                            {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопка выхода */}
            <button
                className="logout-button"
                onClick={onLogout}
                style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
                title="Выйти из системы"
            >
                Выйти
            </button>
        </div>
    )
}

export default UserProfile