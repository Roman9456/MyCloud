import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Correct for v6+
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Register } from './components/Auth/Register';
import { Login } from './components/Auth/Login/Login';
import { FileManager } from './components/FileManager';
import { FileUpload } from './components/File/FileUpload';
import { checkAuth } from './redux/actions';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user);
    console.log("User in ProtectedRoute:", user);
    return user ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

const App = () => {
    const dispatch = useDispatch();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const authenticate = async () => {
            try {
                await dispatch(checkAuth());
                setIsAuthChecked(true);
            } catch (error) {
                console.error("Authentication failed:", error);
                setIsAuthChecked(true); // You can decide what to show to the user in case of failure
            }
        };
        authenticate();
    }, [dispatch]);

    if (!isAuthChecked) {
        return <div>Loading...</div>; // Optionally add a more specific loading spinner or message
    }

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/files" 
                    element={
                        <ProtectedRoute>
                            <FileManager />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/upload" 
                    element={
                        <ProtectedRoute>
                            <FileUpload />
                        </ProtectedRoute>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
