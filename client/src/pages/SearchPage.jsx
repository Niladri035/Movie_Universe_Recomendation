import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tmdbApi } from '../api/tmdb';
import { setSearchResults, setSearchLoading, setError } from '../store/slices/moviesSlice';
import MovieCard from '../components/movies/MovieCard';
import { FaSearch, FaFilter, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('multi'); // multi, movie, tv
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const dispatch = useDispatch();
  const { searchResults, searchLoading, error } = useSelector((state) => state.movies);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Debounced search logic for initial query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setPage(1);
        performSearch(query, 1, false);
      } else {
        dispatch(setSearchResults([]));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeType]);

  // Load more logic
  useEffect(() => {
    if (inView && hasMore && !searchLoading && query.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(query, nextPage, true);
    }
  }, [inView, hasMore, searchLoading]);

  const performSearch = async (searchTerm, pageNum, append = false) => {
    dispatch(setSearchLoading(true));
    try {
      const res = await tmdbApi.search(searchTerm, pageNum);
      const results = res.data.results;
      
      if (append) {
        dispatch(setSearchResults([...searchResults, ...results]));
      } else {
        dispatch(setSearchResults(results));
      }

      setHasMore(results.length > 0 && pageNum < res.data.total_pages);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setSearchLoading(false));
    }
  };

  const clearSearch = () => {
    setQuery('');
    setPage(1);
    setHasMore(true);
    dispatch(setSearchResults([]));
  };

  return (
    <div className="search-page container">
      <div className="search-header-section">
        <h1 className="heading-lg text-gradient">Search Universe</h1>
        
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search movies, TV shows, people..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && <FaTimes className="clear-icon" onClick={clearSearch} />}
          </div>
        </div>

        <div className="filter-chips">
          {['multi', 'movie', 'tv'].map((type) => (
            <button 
              key={type}
              className={`filter-chip ${activeType === type ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results-grid">
        {searchResults.length > 0 && (
          searchResults.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 20) * 0.05 }}
            >
              <MovieCard movie={item} type={item.media_type || 'movie'} />
            </motion.div>
          ))
        )}

        {/* Loading / End of life states */}
        <div ref={ref} className="search-status">
          {searchLoading ? (
            <div className="loading-spinner">
              <FaSpinner className="spin" />
              <span>Scanning deep space...</span>
            </div>
          ) : query && searchResults.length === 0 ? (
            <h2 className="heading-md">No results found in this sector.</h2>
          ) : !query ? (
            <p className="text-muted">Type something to begin your discovery.</p>
          ) : !hasMore && searchResults.length > 0 ? (
            <p className="text-muted">End of the Universe reached.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
