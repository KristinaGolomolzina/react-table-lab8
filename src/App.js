import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/Store.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // 7 тили Bootstrap
import './App.css';
import Pattern from './components/Pattern';
import { ThemeProvider } from './components/ThemeContext.js';
// import Navigation from './components/Navigation.js';
import useLoginState from './hooks/useLoginState.js';
import LoginForm from './components/form/LoginForm.js';

function AppContent() {
  const { isLoggedIn, login, logout } = useLoginState();

  return (
    <div className="App">
      <Router>
        {isLoggedIn ? (
          // Если пользователь авторизован просто показываем Pattern
          <Pattern onLogout={logout} />
        ) : (
          // Иначе показываем форму входа
          <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <LoginForm onLogin={login} />
          </div>
        )}
      </Router>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App