import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockModels, mockCategories } from '../../data/mockData';
import './Explore.css';

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter models based on search term and active category
  const filteredModels = mockModels.filter(model => {
    // 1. Filter by category
    if (activeCategory !== 'All Categories' && model.category !== activeCategory) {
      return false;
    }
    
    // 2. Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = model.name.toLowerCase().includes(term);
      const matchesCategory = model.category && model.category.toLowerCase().includes(term);
      
      if (!matchesName && !matchesCategory) {
        return false;
      }
    }
    
    return true;
  });

  const displayModels = filteredModels;

  return (
    <div className="explore container">
      <div className="explore-header">
        <h1 className="page-title">Explore Models</h1>
        <div className="explore-controls">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline filter-btn">
            <Filter size={18} /> Filters
          </button>
          <select className="sort-select">
            <option>Most Popular</option>
            <option>Recently Added</option>
            <option>Most Downloaded</option>
          </select>
        </div>
      </div>

      <div className="explore-layout">
        <aside className="explore-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <ul className="category-list">
              <li 
                className={`category-item ${activeCategory === 'All Categories' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All Categories')}
              >
                <span>All Categories</span>
              </li>
              {mockCategories.map(cat => (
                <li 
                  key={cat.id} 
                  className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span>{cat.name}</span>
                  <span className="count">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="explore-content">
          <div className="models-grid">
            {displayModels.length > 0 ? (
              displayModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No models found in this category.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
