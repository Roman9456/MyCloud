import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AuthForm } from './components/Login/LoginPage';  
import HomePage from './components/HomePage/HomePage';  
import MainPage from './components/MainPage/MainPage.jsx'; // Importing MainPage
import FileUploadAndList from './components/Files/Files'; 
import { SignUpPage } from './components/Reg/SignUpPage';  
import { checkAuth } from './redux/actions'; 
import NotFoundPage from './components/NotFound/NotFoundPage';

// Component for protected routes
const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user);
    console.log("User in ProtectedRoute:", user);
    return user ? children : <Navigate to="/login" />;  // Redirect to login page if user is not authenticated
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user); // Get user data from Redux state
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    // Check user authentication on app load
    useEffect(() => {
        const authenticate = async () => {
            await dispatch(checkAuth());
            setIsAuthChecked(true);
        };
        authenticate();
    }, [dispatch]);

    // Show loading state if auth check is not complete
    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* Home page with buttons for registration and login */}
                <Route path="/" element={<HomePage />} />
                
                {/* Registration page */}
                <Route path="/register" element={<SignUpPage />} />
                
                {/* Login page */}
                <Route path="/login" element={<AuthForm />} />
                
                {/* Files page, protected route */}
                <Route 
                    path="/files" 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* File upload page, protected route */}
                <Route 
                    path="/upload" 
                    element={
                        <ProtectedRoute>
                            <FileUploadAndList />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Main page, protected route */}
                <Route 
                    path="/main" 
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 404 page for all non-existent routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;
