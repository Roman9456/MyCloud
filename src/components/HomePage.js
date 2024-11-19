import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      <h1>Welcome to My Cloud Storage</h1>
      <p>Store your files securely and access them from anywhere!</p>
      <div className="buttons">
        <Link to="/register">
          <button className="button">Register</button>
        </Link>
        <Link to="/login">
          <button className="button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
