import React from 'react';
import { Link } from 'react-router-dom';  

function NotFoundPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={styles.link}>Go to Homepage</Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  title: {
    fontSize: '3em',
    color: '#f44336',
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    fontSize: '1.2em',
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default NotFoundPage;
