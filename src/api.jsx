import axios from 'axios';

// Инициализируем API_URL до его использования
const API_URL = import.meta.env.VITE_API_URL;

// Логирование для отладки
console.log("VITE_API_URL:", API_URL);

// Далее вы можете использовать API_URL в ваших запросах
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}auth/register/`, userData);
};

// Логин пользователя
export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}auth/login/`, credentials);
};

// Получение списка файлов
export const fetchFiles = async (token) => {
    return await axios.get(`${API_URL}files/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Загрузка файла с комментарием
export const uploadFile = async (file, comment, token) => {
    const formData = new FormData();
    formData.append('file_path', file);
    formData.append('comment', comment);
    return await axios.post(`${API_URL}files/`, formData, {
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });
};

// Обновление комментария к файлу
export const updateComment = async (fileId, comment, token) => {
    return await axios.patch(`${API_URL}files/${fileId}/`, { comment }, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Обновление имени файла
export const updateFileName = async (fileId, newName, token) => {
    return await axios.patch(`${API_URL}files/${fileId}/rename_file/`, { new_name: newName }, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Удаление файла
export const deleteFile = async (fileId, token) => {
    return await axios.delete(`${API_URL}files/${fileId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Получение списка пользователей
export const fetchUsers = async (token) => {
    return await axios.get(`${API_URL}users/list_users/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Получение файлов пользователя
export const fetchMyFiles = async (token) => {
    return await axios.get(`${API_URL}files/my_files/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};

// Получение данных текущего пользователя
export const fetchUserData = async (token) => {
    return await axios.get(`${API_URL}users/me/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        withCredentials: true,
    });
};
