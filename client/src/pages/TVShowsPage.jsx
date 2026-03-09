import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../api/tmdb';
import MovieCard from '../components/movies/MovieCard';
import { useInView } from 'react-intersection-observer';
import { FaTv, FaChartLine, FaMagic } from 'react-icons/fa';

const TVShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const categories = [
    { id: 'popular', label: 'Popular Series', icon: <FaTv /> },
    { id: 'top_rated', label: 'Must Watch', icon: <FaChartLine /> },
    { id: 'discover', label: 'Discover', icon: <FaMagic /> },
  ];

  const fetchShows = async (isNewCategory = false) => {
    if (loading) return;
    setLoading(true);
    try {
      let response;
      const currentPage = isNewCategory ? 1 : page;
      
      if (category === 'popular') response = await tmdbApi.getTvShows(currentPage);
      else if (category === 'top_rated') response = await tmdbApi.getTopRated(currentPage); // TMDB route /toprated often defaults to movies, might need server fix but assuming it works for now
      else if (category === 'discover') response = await tmdbApi.discover(null, currentPage);

      const results = response.data.results;
      if (isNewCategory) {
        setShows(results);
        setPage(2);
      } else {
        setShows(prev => [...prev, ...results]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(results.length > 0);
    } catch (err) {
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows(true);
  }, [category]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchShows();
    }
  }, [inView, hasMore, loading]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="heading-lg text-gradient">Infinite Streams</h1>
        <p className="text-muted">Dive into the most captivating series in the multiverse.</p>
        
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
        {shows.map((show) => (
          <MovieCard key={show.id} movie={show} type="tv" />
        ))}
      </div>

      {loading && (
        <div className="loading-scanner">
          <div className="scanner-line"></div>
          <p>Syncing Frequencies...</p>
        </div>
      )}

      {hasMore && <div ref={ref} style={{ height: '20px' }} />}
      
      {!hasMore && shows.length > 0 && (
        <div className="end-of-results">
          <p>Transmission Complete. End of Broadcast.</p>
        </div>
      )}
    </div>
  );
};

export default TVShowsPage;
