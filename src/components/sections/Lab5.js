import { useState, useContext } from 'react';
import Container from "../Container";
import { ThemeContext } from "../ThemeContext.js";
import RegisterForm from "../form/RegisterForm";
import LoginForm from "../form/LoginForm";
import FeedbackForm from '../form/FeedbackForm.js';
import FeedbackList from '../FeedbackList.js';
import { useApi } from '../../hooks/useApi.js'; // Заменяем useFeedback на useApi
import './Lab5.css';

function Lab5() {
    const [activeTab, setActiveTab] = useState('register');
    const { colors } = useContext(ThemeContext);

    // Используем Redux хук вместо кастомного хука
    const { user } = useApi();

    return (
        <div className="lab5-page" style={{ backgroundColor: colors.background, color: colors.text }}>
            <Container>
                <h1>Лабораторная работа №5</h1>
                <h2>Формы регистрации и авторизации с React Hook Form</h2>

                {/* Информация о пользователе если авторизован */}
                {user && (
                    <div className="user-info" style={{
                        background: '#e7f3ff',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        color: '#0066cc'
                    }}>
                        <strong>Вы вошли как:</strong> {user.username}
                        {user.role === 'admin' && (
                            <span style={{
                                marginLeft: '10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}>
                                Администратор
                            </span>
                        )}
                    </div>
                )}

                {/* Переключение между формами */}
                <div className="tabs-container">
                    <button
                        className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                        style={{ backgroundColor: activeTab === 'register' ? colors.primary : 'transparent' }}
                    >
                        Регистрация
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                        style={{ backgroundColor: activeTab === 'login' ? colors.primary : 'transparent' }}
                    >
                        Вход
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feedback')}
                        style={{ backgroundColor: activeTab === 'feedback' ? colors.primary : 'transparent' }}
                    >
                        Обратная связь
                    </button>
                </div>

                {/* Отображение активной формы */}
                <div>
                    {activeTab === 'register' && <RegisterForm />}
                    {activeTab === 'login' && <LoginForm />}
                    {activeTab === 'feedback' && (
                        <div className="feedback-section">
                            {/* FeedbackForm теперь работает самостоятельно через Redux */}
                            <FeedbackForm />
                            {/* FeedbackList теперь работает самостоятельно через Redux */}
                            <FeedbackList readOnly={user?.role !== 'admin'}/> 
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Lab5;