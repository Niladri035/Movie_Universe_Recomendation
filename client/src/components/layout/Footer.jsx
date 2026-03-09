import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaInstagram, FaPlay } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="heading-md text-gradient">Movie Universe</h2>
            <p className="text-muted">The ultimate cinematic discovery platform powered by TMDB and WebGL technology.</p>
            <div className="social-links">
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaGithub /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Navigation</h3>
            <Link to="/">Home</Link>
            <Link to="/search">Discovery</Link>
            <Link to="/favorites">My Library</Link>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Experience</h3>
            <a href="#">3D Visualizer</a>
            <a href="#">Cinematic UI</a>
            <a href="#">Premium Plan</a>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Info</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Movie Universe. Designed with ❤️ for Cinephiles.</p>
          <p className="tmdb-attr">Data provided by <span className="tmdb-color">TMDB</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
