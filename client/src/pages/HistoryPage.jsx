import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { historyApi } from '../api/userFeatures';
import { setHistory, setLoading, clearHistory } from '../store/slices/historySlice';
import MovieCard from '../components/movies/MovieCard';
import { FaHistory, FaTrashAlt, FaSatellite } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.history);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return;
      dispatch(setLoading(true));
      try {
        const { data } = await historyApi.getHistory();
        dispatch(setHistory(data));
      } catch (err) {
        console.error("History fetch failed", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchHistory();
  }, [dispatch, isAuthenticated]);

  const handleClearHistory = async () => {
    if (window.confirm("Purge all cosmic footprints from your history?")) {
      try {
        await historyApi.clearHistory();
        dispatch(clearHistory());
        toast.success("History purged.");
      } catch (err) {
        toast.error("Failed to clear history.");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="user-hub-page container auth-nag">
        <FaSatellite className="nag-icon" />
        <h2 className="heading-md">Access Restricted</h2>
        <p>Log in to track your footprints through the Universe.</p>
      </div>
    );
  }

  return (
    <div className="user-hub-page container">
      <div className="hub-header">
        <div className="header-top">
          <h1 className="heading-lg text-gradient"><FaHistory className="title-icon" /> Watch History</h1>
          {items.length > 0 && (
            <button className="clear-btn" onClick={handleClearHistory}>
              <FaTrashAlt /> Purge History
            </button>
          )}
        </div>
        <p className="subtitle">Your chronological journey through the cinematic galaxy.</p>
      </div>

      <div className="hub-grid">
        {loading ? (
          <div className="hub-status"><h2 className="heading-md pulse">Retrieving data...</h2></div>
        ) : items.length > 0 ? (
          items.map((movie, index) => (
            <motion.div
              key={movie.id || movie.tmdbId || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <MovieCard movie={movie} type={movie.mediaType || 'movie'} />
            </motion.div>
          ))
        ) : (
          <div className="hub-status">
            <h2 className="heading-md">No footprints found.</h2>
            <p>Your journey begins with your first movie discovery.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
