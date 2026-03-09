import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { authApi } from './api/auth';
import { setUser, logout } from './store/slices/authSlice';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import TrailerModal from './components/ui/TrailerModal';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import PricingPage from './pages/PricingPage';
import { ProtectedRoute, AdminRoute } from './components/auth/RouteGuards';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("GLOBAL REACT ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', color: '#e50914', background: '#050505', minHeight: '100vh', overflowY: 'auto' }}>
          <h1 className="heading-xl">System Overload</h1>
          <p>The Cinematic Universe encountered a fatal error.</p>
          <pre style={{ color: '#fff', background: '#111', padding: '20px', overflow: 'auto', margin: '20px 0' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const theme = useSelector(state => state.ui.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('movieplatform_token');
      if (!token) return;

      try {
        const { data } = await authApi.getMe();
        dispatch(setUser(data.user));
      } catch (err) {
        console.error("Session restoration failed:", err);
        dispatch(logout());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <GlobalErrorBoundary>
      <ScrollToTop />
      <div className="app-main-layout">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/premium" element={<PricingPage />} />
            <Route path="/:type/:id" element={<MovieDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <TrailerModal />
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(10px)',
            }
          }}
        />
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
