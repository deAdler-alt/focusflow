import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BoardView from './BoardView';
import CalendarView from './CalendarView';
import './App.css';

function App() {
  return (
      <div className="app-container">
        <Toaster position="top-center" reverseOrder={false} />
        
        <nav className="main-nav">
          <Link to="/">Tablica</Link>
          <Link to="/calendar">Kalendarz</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </div>
  );
}

export default App;