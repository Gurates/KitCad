import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">K</span>
            KitCAD
          </Link>
          <p className="footer-desc">
            The platform for the FRC community to share, discover, and download CAD models.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} KitCAD. Built by Team 9021.</p>
      </div>
    </footer>
  );
};

export default Footer;
