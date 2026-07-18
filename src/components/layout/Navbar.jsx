import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
            <span className="logo-icon">K</span>
            KitCAD
          </Link>
          <div className="navbar-links desktop-only">
            <Link to="/explore" className="nav-link">Explore</Link>
          </div>
        </div>

        <div className="navbar-center desktop-only">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search models or teams..." />
          </div>
        </div>

        <div className="navbar-right">
          <button onClick={toggleTheme} className="theme-toggle-btn desktop-only" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="mobile-menu-btn btn btn-ghost mobile-only" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            style={{ border: 'none', background: 'none', color: 'var(--color-text-main)', padding: '4px' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="mobile-menu mobile-only">
          <div className="mobile-menu-search">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search models or teams..." style={{ width: '100%' }} />
            </div>
          </div>
          <div className="mobile-menu-links">
            <Link to="/explore" className="nav-link" onClick={() => setIsOpen(false)}>Explore</Link>
            <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="mobile-theme-toggle nav-link">
              {theme === 'dark' ? (
                <span style={{ display: 'flex', alignItems: 'center' }}><Sun size={18} style={{ marginRight: '8px' }} /> Light Mode</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center' }}><Moon size={18} style={{ marginRight: '8px' }} /> Dark Mode</span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
