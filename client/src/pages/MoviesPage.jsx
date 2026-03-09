import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../api/tmdb';
import MovieCard from '../components/movies/MovieCard';
import { useInView } from 'react-intersection-observer';
import { FaFire, FaStar, FaCalendarAlt } from 'react-icons/fa';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const categories = [
    { id: 'popular', label: 'Trending', icon: <FaFire /> },
    { id: 'top_rated', label: 'Top Rated', icon: <FaStar /> },
    { id: 'upcoming', label: 'Upcoming', icon: <FaCalendarAlt /> },
  ];

  const fetchMovies = async (isNewCategory = false) => {
    if (loading) return;
    setLoading(true);
    try {
      let response;
      const currentPage = isNewCategory ? 1 : page;
      
      if (category === 'popular') response = await tmdbApi.getPopular(currentPage);
      else if (category === 'top_rated') response = await tmdbApi.getTopRated(currentPage);
      else if (category === 'upcoming') response = await tmdbApi.getUpcoming(); // Upcoming doesn't always support page in simple TMDB wrappers

      const results = response.data.results;
      if (isNewCategory) {
        setMovies(results);
        setPage(2);
      } else {
        setMovies(prev => [...prev, ...results]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(results.length > 0 && category !== 'upcoming');
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(true);
  }, [category]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMovies();
    }
  }, [inView, hasMore, loading]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="heading-lg text-gradient">Cinematic Universe</h1>
        <p className="text-muted">Explore the greatest films ever captured.</p>
        
        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="movie" />
        ))}
      </div>

      {loading && (
        <div className="loading-scanner">
          <div className="scanner-line"></div>
          <p>Scanning Sectors...</p>
        </div>
      )}

      {hasMore && <div ref={ref} style={{ height: '20px' }} />}
      
      {!hasMore && movies.length > 0 && (
        <div className="end-of-results">
          <p>You have reached the edge of this galaxy.</p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
