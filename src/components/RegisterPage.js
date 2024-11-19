import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '', // If this field is not needed, you can remove it from the state
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState('');  // For server errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Data validation
    const errorMessages = {};
    if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.username)) {
      errorMessages.username = 'Username must be between 4 and 20 characters and contain only letters and numbers.';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errorMessages.email = 'Please enter a valid email address.';
    }
    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(formData.password)) {
      errorMessages.password = 'Password must be at least 6 characters, with one uppercase letter, one number, and one special character.';
    }

    setErrors(errorMessages);

    if (Object.keys(errorMessages).length === 0) {
      try {
        const response = await axios.post('http://localhost:8000/api/register/', formData);

        if (response.status === 201) {
          // If registration is successful, navigate to the login page
          navigate('/login');
        }
      } catch (error) {
        console.error('Registration failed', error);

        // Check for a 400 error from the server (e.g., user already exists)
        if (error.response && error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData.username) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: errorData.username, // Add error message for the username field
            }));
          }
          if (errorData.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: errorData.email, // Add error message for the email field
            }));
          }
        } else {
          // If another error occurred
          setServerError('Registration failed. Please try again.');
        }
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <button type="submit">Register</button>
      </form>

      {/* If there's a server error, display it */}
      {serverError && <div className="error">{serverError}</div>}
    </div>
  );
};

export default RegisterPage;
