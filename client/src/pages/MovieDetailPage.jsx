import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { tmdbApi } from '../api/tmdb';
import { openTrailerModal } from '../store/slices/uiSlice';
import { motion } from 'framer-motion';
import MovieRow from '../components/movies/MovieRow';
import { FaPlay, FaPlus, FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa';

const MovieDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = type === 'movie' ? await tmdbApi.getMovie(id) : await tmdbApi.getTvShow(id);
        setData(res.data);
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  if (loading) return <div className="loading-screen"><h2 className="heading-md">Scanning Archive...</h2></div>;
  if (error) return <div className="error-screen container">Error: {error}</div>;
  if (!data) return null;

  const backdrop = `${import.meta.env.VITE_TMDB_IMAGE_BASE}/original${data.backdrop_path}`;
  const poster = `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w500${data.poster_path}`;
  const trailer = data.videos?.results?.find(v => v.type === 'Trailer' || v.site === 'YouTube');
  const cast = data.credits?.cast?.slice(0, 10);

  return (
    <div className="movie-detail-page">
      {/* Hero Backdrop */}
      <div className="detail-hero" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="poster-container"
          >
            <img src={poster} alt={data.title || data.name} className="detail-poster" />
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="info-container"
          >
            <h1 className="heading-xl title">{data.title || data.name}</h1>
            <div className="meta-row">
              <span className="rating"><FaStar /> {data.vote_average?.toFixed(1)}</span>
              <span className="runtime"><FaClock /> {data.runtime || data.episode_run_time?.[0]} min</span>
              <span className="year"><FaCalendarAlt /> {new Date(data.release_date || data.first_air_date).getFullYear()}</span>
            </div>
            
            <p className="tagline">{data.tagline}</p>
            <p className="overview">{data.overview}</p>

            <div className="action-btns">
              <button 
                className="btn-primary play-btn" 
                onClick={() => dispatch(openTrailerModal(trailer?.key))}
              >
                <FaPlay /> Watch Trailer
              </button>
              <button className="btn-secondary add-btn">
                <FaPlus /> Add to List
              </button>
            </div>

            <div className="genres">
              {data.genres?.map(g => (
                <span key={g.id} className="genre-pill">{g.name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cast Section */}
      <section className="cast-section container">
        <h2 className="heading-md section-title">Top Cast</h2>
        <div className="cast-grid">
          {cast?.map(person => (
            <div key={person.id} className="cast-card">
              <div className="cast-img-wrapper">
                <img 
                  src={person.profile_path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'} 
                  alt={person.name} 
                />
              </div>
              <p className="name">{person.name}</p>
              <p className="character">{person.character}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      {data.recommendations?.results?.length > 0 && (
        <MovieRow title="More Like This" movies={data.recommendations.results} type={type} />
      )}
    </div>
  );
};

export default MovieDetailPage;
