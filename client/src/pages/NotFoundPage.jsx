import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="not-found-page container">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="not-found-content"
      >
        <h1 className="heading-xl gradient-text">404</h1>
        <h2 className="heading-md">Lost in Space?</h2>
        <p className="text-muted">The coordinate you typed doesn't exist in this sector of the universe.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: '30px' }}>Return to Base</Link>
      </motion.div>
      
      {/* Decorative stars/floating elements could go here */}
    </div>
  );
};

export default NotFoundPage;
