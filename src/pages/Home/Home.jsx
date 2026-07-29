import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockModels, mockCategories } from '../../data/mockData';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-text">9021</div>
        <div className="container hero-container">
          <h1 className="hero-title">The CAD Platform for the FRC Community</h1>
          <p className="hero-subtitle">Discover, share, and download thousands of CAD models built by and for FIRST Robotics Competition teams.</p>
          
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input-wrapper">
              <Search className="hero-search-icon" size={24} />
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">Search</button>
          </form>
        </div>
      </section>

      {/* Featured Models */}
      <section className="models-section container">
        <div className="section-header">
          <h2 className="section-title">Featured Models</h2>
          <Link to="/explore" className="section-link">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="models-grid">
          {mockModels.slice(0, 6).map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
