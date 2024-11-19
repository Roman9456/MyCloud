import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);  // Состояние для загрузки
  const [error, setError] = useState(null);  // Состояние для ошибок
  const [file, setFile] = useState(null); // Для хранения выбранного файла
  const [uploading, setUploading] = useState(false); // Состояние для процесса загрузки

  // Функция для получения файлов
  const fetchFiles = async () => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
    if (!token) {
      setError('No token found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/files/', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовки
        },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(`Failed to load files. ${error.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем файлы при монтировании компонента
  useEffect(() => {
    fetchFiles(); // Вызываем функцию загрузки файлов
  }, []); // Пустой массив зависимостей, чтобы запросить данные только при монтировании компонента

  // Форматируем дату для удобного отображения
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString(); // Форматируем дату в строку
  };

  // Обработчик изменения выбранного файла
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Сохраняем выбранный файл
  };

  // Обработчик отправки файла
  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const token = localStorage.getItem('authToken'); // Получаем токен
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true); // Начинаем загрузку

    try {
      await axios.post('http://localhost:8000/api/files/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Указываем тип контента
        },
      });
      setFile(null); // Очищаем выбранный файл после успешной загрузки
      setError(null); // Очищаем ошибку
      fetchFiles(); // Перезагружаем файлы после успешной загрузки
    } catch (error) {
      setError(`Failed to upload file. ${error.message || 'Please try again.'}`);
    } finally {
      setUploading(false); // Завершаем загрузку
    }
  };

  return (
    <div>
      <h2>Your Files</h2>
      
      {loading && <p>Loading files...</p>}
      {error && <p className="error">{error}</p>}

      {/* Форма загрузки файлов */}
      <div>
        <h3>Upload New File</h3>
        <input 
          type="file" 
          onChange={handleFileChange} 
        />
        <button 
          onClick={handleFileUpload} 
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file.id}>
              <div>{file.name}</div>
              <div>{file.size} bytes</div>
              <div>{formatDate(file.upload_date)}</div>
              {/* Можно добавить дополнительные действия для управления файлом */}
            </li>
          ))
        ) : (
          <p>No files available</p>
        )}
      </ul>
    </div>
  );
};

export default FileManager;
