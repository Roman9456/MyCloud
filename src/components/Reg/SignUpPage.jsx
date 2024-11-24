import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/actions'; // Importing the register action
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';  

export const SignUpPage = () => {
    const [userAlias, setUserAlias] = useState(''); // State for username
    const [userEmail, setUserEmail] = useState(''); // State for email
    const [userSecret, setUserSecret] = useState(''); // State for password
    const [formError, setFormError] = useState(''); // For displaying errors
    const dispatch = useDispatch(); // For dispatching actions
    const navigate = useNavigate(); // For navigation after successful registration

    // Form submit handler
    const submitHandler = async (event) => {
        event.preventDefault();
        
        // Check for empty fields
        if (!userAlias || !userEmail || !userSecret) {
            setFormError("Please fill in all fields.");
            return;
        }

        try {
            // Dispatch the registration action with the form data
            await dispatch(register({ username: userAlias, email: userEmail, password: userSecret }));
            navigate('/documents'); // Redirect after successful registration
        } catch (submissionError) {
            console.error(submissionError);
            setFormError("Unable to complete registration. Please verify details.");
        }
    };

    return (
        <form className="signup-container" onSubmit={submitHandler}>
            <div className="input-group">
                <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={userAlias}
                    onChange={(event) => setUserAlias(event.target.value)} // Update username
                    autoComplete="username"
                    required
                />
            </div>
            <div className="input-group">
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)} // Update email
                    autoComplete="email"
                    required
                />
            </div>
            <div className="input-group">
                <input
                    type="password"
                    name="password"
                    placeholder="Choose a password"
                    value={userSecret}
                    onChange={(event) => setUserSecret(event.target.value)} // Update password
                    autoComplete="new-password"
                    required
                />
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
            {formError && <p className="error-message">{formError}</p>} {/* Display error message */}
        </form>
    );
};
