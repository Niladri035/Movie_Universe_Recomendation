import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleSearch } from '../../store/slices/uiSlice';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaHistory, FaHeart, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <h1 className="heading-md text-gradient">Movie Universe</h1>
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''}>Movies</Link></li>
            <li><Link to="/tv" className={location.pathname === '/tv' ? 'active' : ''}>TV Shows</Link></li>
            <li><Link to="/premium" className={location.pathname === '/premium' ? 'active' : ''}>Premium</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favorites</Link></li>
                <li><Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
              </>
            )}
            {user?.role === 'admin' && (
              <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link></li>
            )}
          </ul>
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn" onClick={() => navigate('/search')}>
            <FaSearch />
          </button>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <div className="user-profile-trigger">
                <FaUserCircle />
                <span className="user-name">{user.name}</span>
              </div>
              <div className="user-dropdown">
                {user.role === 'admin' && (
                  <Link to="/admin"><FaShieldAlt /> Admin Panel</Link>
                )}
                <Link to="/favorites"><FaHeart /> My Favorites</Link>
                <Link to="/history"><FaHistory /> Watch History</Link>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-text">Login</Link>
              <Link to="/signup" className="btn-primary-sm">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
