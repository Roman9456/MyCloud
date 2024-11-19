import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import FileManager from './components/FileManager';
import NotFoundPage from './components/NotFoundPage';
import FileUpload from './components/FileUpload';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/files" element={<FileManager />} />
        <Route path="/upload" element={<FileUpload />} /> {/* Маршрут для загрузки файлов */}
        <Route path="*" element={<NotFoundPage />} /> {/* Маршрут для 404 */}
      </Routes>
    </Router>
  );
}

export default App;
