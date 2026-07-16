import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
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
          <Link to="/user/u1" className="profile-btn desktop-only">
            <User size={20} />
          </Link>
          <button className="mobile-menu-btn btn btn-ghost mobile-only">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
