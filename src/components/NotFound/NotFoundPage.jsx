import React from 'react';
import './NotFoundPage.css';  

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="back-to-home">Go back to Home</a>
    </div>
  );
};

export default NotFoundPage;
