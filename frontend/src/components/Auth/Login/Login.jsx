import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/actions';
import styles from './Login.module.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Состояние для отслеживания загрузки
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Начало загрузки
        try {
            await dispatch(login({ username, password }));
            navigate('/files');
        } catch (err) {
            console.error(err);
            setError("Invalid credentials. Please try again.");  // Сообщение об ошибке
        } finally {
            setLoading(false);  // Завершение загрузки
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles['login-container']}>
            <div className={styles.greeting}>
                <p>Welcome to MyCloud</p>
                <p>Your data, always secure and accessible!</p>
            </div>
            <form className={styles['login-form']} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
                <div className={styles['buttons-container']}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" onClick={handleRegister}>Register</button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};
