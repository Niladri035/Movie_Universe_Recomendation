import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { favoritesApi } from '../api/userFeatures';
import { setFavorites, setLoading, setError } from '../store/slices/favoritesSlice';
import MovieCard from '../components/movies/MovieCard';
import { FaHeart, FaSatellite } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      dispatch(setLoading(true));
      try {
        const { data } = await favoritesApi.getFavorites();
        dispatch(setFavorites(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchFavorites();
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="user-hub-page container auth-nag">
        <FaSatellite className=" nag-icon" />
        <h2 className="heading-md">Connection Lost</h2>
        <p>You must be authenticated to access your encrypted favorites.</p>
        <button className="btn-primary" onClick={() => window.location.href = '/login'}>Re-establish Link</button>
      </div>
    );
  }

  return (
    <div className="user-hub-page container">
      <div className="hub-header">
        <h1 className="heading-lg text-gradient"><FaHeart className="title-icon" /> Your Collection</h1>
        <p className="subtitle">Curated masterpieces from your cosmic discovery.</p>
      </div>

      <div className="hub-grid">
        {loading ? (
          <div className="hub-status"><h2 className="heading-md pulse">Scanning archive...</h2></div>
        ) : items.length > 0 ? (
          items.map((movie, index) => (
            <motion.div
              key={movie.id || movie.tmdbId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard movie={movie} type={movie.mediaType || 'movie'} />
            </motion.div>
          ))
        ) : (
          <div className="hub-status">
            <h2 className="heading-md">Your archive is empty.</h2>
            <p>Start exploring and heart your favorite cinematic experiences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
