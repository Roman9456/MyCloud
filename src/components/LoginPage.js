import '../App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Отправка данных для логина
      const response = await axios.post('http://localhost:8000/api/login/', loginData, {
        headers: {
          'Content-Type': 'application/json',  // Указание типа содержимого, если нужно
        }
      });

      if (response.status === 200) {
        // Проверяем наличие токена в ответе и сохраняем его
        const token = response.data.access_token; // Обратите внимание на правильное имя: access_token
        if (token) {
          localStorage.setItem('authToken', token);  // Сохраняем токен в localStorage
          // Переходим на страницу файлов
          navigate('/files');
        } else {
          setError('No token received');
        }
      } else {
        setError('Login failed, please try again');
      }
    } catch (error) {
      // Логируем ошибку и выводим более подробную информацию
      console.error(error);
      // Проверяем, есть ли данные в error.response
      setError(error.response ? error.response.data.message : 'Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
