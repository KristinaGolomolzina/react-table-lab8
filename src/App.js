import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux'; // Импортируем Provider
import { store } from './components/Store.js'; // Импортируем store
import './App.css';
import Pattern from './components/Pattern';
import { ThemeProvider } from './components/ThemeContext.js';

function App() {
  return (
    <Provider store={store}> {/* Оборачиваем в Provider */}
    <ThemeProvider>
      <Router> {/* Оборачиваем всё в Router */}
        <Pattern> 
        </Pattern>
      </Router>
    </ThemeProvider>
    </Provider>
  );
}

export default App;