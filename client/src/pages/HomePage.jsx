import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tmdbApi } from '../api/tmdb';
import { setTrending, setPopular, setTopRated, setTvShows, setUpcoming, setLoading, setError } from '../store/slices/moviesSlice';
import Hero3D from '../components/movies/Hero3D';
import MovieCard from '../components/movies/MovieCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const MovieRow = ({ title, movies, type = 'movie' }) => {
  const rowRef = useRef();

  useGSAP(() => {
    if (rowRef.current) {
      gsap.from(rowRef.current.children, {
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 92%',
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        rotateX: 10,
        duration: 1,
        stagger: 0.08,
        ease: 'elastic.out(1, 0.8)',
      });
    }
  }, { scope: rowRef });

  return (
    <section className="movie-section container" style={{ marginBottom: '80px' }}>
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>{title}</h2>
      </motion.div>
      <div className="horizontal-scroll" ref={rowRef}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type={type} />
        ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending, popular, topRated, tvShows, upcoming, loading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    const fetchMovies = async () => {
      dispatch(setLoading(true));
      try {
        const [trendRes, popRes, topRes, tvRes, upRes] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getPopular(),
          tmdbApi.getTopRated(),
          tmdbApi.getTvShows(),
          tmdbApi.getUpcoming()
        ]);
        
        dispatch(setTrending(trendRes.data.results));
        dispatch(setPopular(popRes.data.results));
        dispatch(setTopRated(topRes.data.results));
        dispatch(setTvShows(tvRes.data.results));
        dispatch(setUpcoming(upRes.data.results));
      } catch (err) {
        dispatch(setError(err.message));
        console.error("Failed to fetch movies:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (trending.length === 0) {
      fetchMovies();
    }
  }, [dispatch, trending.length]);

  if (loading && trending.length === 0) {
    return (
      <div className="loading-screen" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div className="loading-scanner">
          <div className="scanner-line"></div>
        </div>
        <h1 className="heading-md" style={{ letterSpacing: '8px', textTransform: 'uppercase' }}>Synchronizing...</h1>
      </div>
    );
  }

  if (error) {
    return <div className="error-screen" style={{ color: 'red', marginTop: '100px', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div className="home-page cinematic-mode">
      <div className="film-grain"></div>
      <Hero3D movies={upcoming.length > 0 ? upcoming : trending} />
      
      <motion.div 
        className="main-content-wrapper" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--bg-color)' }}
      >
        {upcoming.length > 0 && <div id="movie-content" style={{ paddingTop: '40px' }}><MovieRow title="Upcoming Spotlights" movies={upcoming} /></div>}
        {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} />}
        {popular.length > 0 && <MovieRow title="Blockbusters" movies={popular} />}
        {tvShows.length > 0 && <MovieRow title="Viral Series" movies={tvShows} type="tv" />}
        {topRated.length > 0 && <MovieRow title="Critic Hall of Fame" movies={topRated} />}
      </motion.div>
    </div>
  );
};

export default HomePage;
