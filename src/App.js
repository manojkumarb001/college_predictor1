import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CollegeFilterPage from './components/CollegeFilterPage';
import UserRegistrationPage from './components/UserRegistrationPage';
import PredictionPage from './components/PredictionPage';
import './index.css';
function App() {
  return (
    <Router>
      <div id="root">
        <header>
          <h1>College Predictor System</h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filter-colleges" element={<CollegeFilterPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/predict" element={<PredictionPage />} />
          </Routes>
        </main>

        {/* ✅ Fix Footer */}
        <footer>
          <p>&copy; 2025 College Predictor</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
