import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../store/authSlice';


const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login/register
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get auth state from Redux
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Check if URL has ?mode=register
        const mode = searchParams.get('mode');
        if (mode === 'register') {
            setIsLoginMode(false);
        }
    }, [searchParams]);
    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Clear errors when switching modes or unmounting
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        try {
            if (isLoginMode) {
                // LOGIN ACTION
                const resultAction = await dispatch(
                    loginUser({
                        email: formData.email,
                        password: formData.password,
                    })
                );

                if (loginUser.fulfilled.match(resultAction)) {
                    // Success! Navigate to home
                    navigate('/', { replace: true });
                }
                // If rejected, error is already in state
            } else {
                // REGISTER ACTION
                const resultAction = await dispatch(
                    registerUser({
                        email: formData.email,
                        password: formData.password,
                        name: formData.name,
                    })
                );

                if (registerUser.fulfilled.match(resultAction)) {
                    // Registration successful - switch to login mode
                    setIsLoginMode(true);
                    setFormData({ email: formData.email, password: '', name: '' });
                    alert('Registration successful! Please login.');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        dispatch(clearError());
        setFormData({ email: '', password: '', name: '' });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isLoginMode ? 'Login' : 'Register'}</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Name field (only for registration) */}
                    {!isLoginMode && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required={!isLoginMode}
                            />
                        </div>
                    )}

                    {/* Email field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            minLength="6"
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Please wait...'
                            : isLoginMode
                                ? 'Login'
                                : 'Create Account'
                        }
                    </button>
                </form>

                {/* Toggle between login/register */}
                <p className="toggle-mode">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="toggle-btn"
                    >
                        {isLoginMode ? 'Register here' : 'Login here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;