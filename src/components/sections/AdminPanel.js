import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import Container from "../Container";
import UsersTable from "../UsersTable";
import FeedbackList from "../FeedbackList";
import { useApi } from "../../hooks/useApi";

const AdminPanel = () => {
  const { colors } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("users");
  const { user } = useApi(); // Получаем данные текущего пользователя

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <Container>
        <h1>Панель администратора</h1>
        <p style={{ marginBottom: "30px", color: colors.text + "CC" }}>
          Управление пользователями и отзывами системы
        </p>

        {/* Навигация по вкладкам */}
        {/* +++++ */}
        {user && user.role === "admin" && (
          <div
            style={{
              display: "flex",
              marginBottom: "30px",
              borderBottom: `2px solid ${colors.primary}`,
            }}
          >
            <button
              onClick={() => setActiveTab("users")}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  activeTab === "users" ? colors.primary : "transparent",
                color: activeTab === "users" ? "white" : colors.text,
                border: "none",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              👥 Управление пользователями
            </button>
            <button
              onClick={() => setActiveTab("feedbacks")}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  activeTab === "feedbacks" ? colors.primary : "transparent",
                color: activeTab === "feedbacks" ? "white" : colors.text,
                border: "none",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              💬 Управление отзывами
            </button>
          </div>
        )}

        {/* Содержимое вкладок */}
        {user && user.role === "admin" && (
          <div>
            {activeTab === "users" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Список пользователей</h2>
                <UsersTable />
              </div>
            )}

            {activeTab === "feedbacks" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Управление отзывами</h2>
                <FeedbackList />
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminPanel;
