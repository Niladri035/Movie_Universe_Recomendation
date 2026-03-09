import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MovieRow = ({ title, movies, type = 'movie' }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">{title}</h2>
      
      <div className="movie-row-wrapper">
        <button 
          className="row-nav left" 
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
        >
          <FiChevronLeft />
        </button>

        <div className="movie-row-list" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type={type} />
          ))}
        </div>

        <button 
          className="row-nav right" 
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
