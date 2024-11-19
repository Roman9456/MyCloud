import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);  // Состояние для хранения выбранного файла
  const [loading, setLoading] = useState(false);  // Состояние для отслеживания загрузки
  const [error, setError] = useState(null);  // Состояние для обработки ошибок
  const [success, setSuccess] = useState(null);  // Состояние для уведомления об успехе

  // Обработчик выбора файла
  const onFileChange = (event) => {
    setFile(event.target.files[0]);  // Получаем выбранный файл
  };

  // Обработчик загрузки файла
  const onFileUpload = async () => {
    const token = localStorage.getItem('authToken'); // Получение токена из localStorage
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);  // Добавляем файл в объект FormData

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',  // Устанавливаем Content-Type как multipart/form-data
        },
      });

      setSuccess('File uploaded successfully!');  // Успешная загрузка
      console.log(response.data);  // Логируем данные ответа сервера
    } catch (error) {
      console.error("Error uploading file:", error);
      setError('Failed to upload file. Please try again.');  // Обработка ошибок
    } finally {
      setLoading(false);  // Остановить индикатор загрузки
    }
  };

  return (
    <div>
      <h2>Upload File</h2>

      {/* Вывод ошибок, если они есть */}
      {error && <p className="error">{error}</p>}
      {/* Вывод сообщения об успешной загрузке */}
      {success && <p className="success">{success}</p>}
      
      <div>
        {/* Поле для выбора файла */}
        <input type="file" onChange={onFileChange} />
        {/* Кнопка для загрузки */}
        <button onClick={onFileUpload} disabled={loading}>Upload</button>
      </div>

      {/* Показываем индикатор загрузки, если файл загружается */}
      {loading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUpload;
