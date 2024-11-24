import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions'; 
import './LoginPage.css';  

export const AuthForm = () => {
    const [userInput, setUserInput] = useState(''); // State for username
    const [userPassword, setUserPassword] = useState(''); // State for password
    const [loginError, setLoginError] = useState(''); // State for login error message
    const dispatchAction = useDispatch(); // Redux dispatch function
    const navigateTo = useNavigate(); // React Router's navigate function

    // Login handler
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            // Use the login action since it’s correctly exported
            await dispatchAction(login({ username: userInput, password: userPassword }));
            navigateTo('/main');  // Navigate to the main page after successful login
        } catch (error) {
            console.error(error);
            setLoginError("Incorrect username or password. Please try again."); // Error message for incorrect login
        }
    };

    const navigateToRegister = () => {
        navigateTo('/register'); // Navigate to the registration page
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Enter username"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)} // Update username state
                autoComplete="username" // Autofill suggestion for username
            />
            <input
                type="password"
                placeholder="Enter password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)} // Update password state
                autoComplete="current-password" // Autofill suggestion for password
            />
            <button type="submit">Sign In</button>
            <button type="button" onClick={navigateToRegister}>Create Account</button>
            {loginError && <p className="error">{loginError}</p>} {/* Show error message if login fails */}
        </form>
    );
};
