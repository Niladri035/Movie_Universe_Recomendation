import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../store/slices/favoritesSlice';
import { favoritesApi, historyApi } from '../../api/userFeatures';
import { toast } from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const MovieCard = ({ movie, type = 'movie' }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isFavorited = favorites.some(f => f.tmdbId === (movie.id || movie.tmdbId));

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Log in to save favorites");

    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(movie.id || movie.tmdbId);
        dispatch(removeFavorite(movie.id || movie.tmdbId));
        toast.success("Removed from collection");
      } else {
        const movieData = {
          tmdbId: movie.id || movie.tmdbId,
          title: movie.title || movie.name,
          poster: movie.poster_path || movie.poster,
          mediaType: type,
          voteAverage: movie.vote_average || movie.voteAverage,
          releaseDate: movie.release_date || movie.first_air_date || movie.releaseDate
        };
        await favoritesApi.addFavorite(movieData);
        dispatch(addFavorite(movieData));
        toast.success("Added to collection");
      }
    } catch (err) {
      toast.error("Cloud sync failed");
    }
  };

  const handleInteraction = () => {
    if (isAuthenticated) {
      historyApi.addToHistory({
        tmdbId: movie.id || movie.tmdbId,
        title: movie.title || movie.name,
        poster: movie.poster_path || movie.poster,
        mediaType: type,
        voteAverage: movie.vote_average || movie.voteAverage,
        releaseDate: movie.release_date || movie.first_air_date || movie.releaseDate
      }).catch(console.error);
    }
  };

  // Movie Data formatting
  const posterPath = movie.poster_path || movie.poster;
  const posterUrl = posterPath ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w500${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Poster';
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date || movie.releaseDate;
  const rating = (movie.vote_average || movie.voteAverage) ? (movie.vote_average || movie.voteAverage).toFixed(1) : 'NR';

  return (
    <Link 
      to={`/${type}/${movie.id || movie.tmdbId}`} 
      className="movie-card-wrapper" 
      onDragStart={e => e.preventDefault()}
      onClick={handleInteraction}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="movie-card"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="movie-poster" style={{ transform: "translateZ(30px)" }}>
          <img src={posterUrl} alt={title} loading="lazy" />
          
          <div className="rating-badge" style={{ transform: "translateZ(50px)" }}>
            <span className="star">★</span> {rating}
          </div>

          <button 
            className={`fav-btn ${isFavorited ? 'active' : ''}`} 
            onClick={toggleFavorite}
            style={{ transform: "translateZ(60px)" }}
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
          </button>
          
          <motion.div 
            className="movie-info-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            style={{ transform: "translateZ(40px)" }}
          >
            <h3 className="title">{title}</h3>
            {releaseDate && <p className="date">{new Date(releaseDate).getFullYear()}</p>}
          </motion.div>
        </div>

        <motion.div 
          className="glow-effect"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>
    </Link>
  );
};

export default MovieCard;
