import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    dispatch(loginStart());
    try {
      console.log("Attempting registration for:", formData.email);
      const { data } = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log("Registration success:", data.user.name);
      dispatch(loginSuccess(data));
      toast.success(`Welcome to the Universe, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      console.error("SIGNUP ERROR FULL RESPONSE:", err.response?.data);
      console.error("SIGNUP ERROR DETAILS:", err);
      const message = err.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign Up</h1>
          <p>Join the Cinematic Discovery</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <FaUser />
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FaLock />
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : <><FaUserPlus style={{ marginRight: '8px' }} /> Join Universe</>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
