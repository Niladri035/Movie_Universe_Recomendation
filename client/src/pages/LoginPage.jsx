import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      console.log("Attempting login for:", formData.email);
      const { data } = await authApi.login(formData);
      console.log("Login success:", data.user.name);
      dispatch(loginSuccess(data));
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      console.error("LOGIN ERROR FULL:", err);
      const message = err.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Welcome back to the Universe</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope />
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FaLock />
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : <><FaSignInAlt style={{ marginRight: '8px' }} /> Access Universe</>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create One</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
