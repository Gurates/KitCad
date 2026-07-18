import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockModels, mockCategories } from '../../data/mockData';
import './Explore.css';

const Explore = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (catName) => {
    if (catName === 'All Categories') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories(prev => 
      prev.includes(catName) 
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  // Filter models based on search term and categories
  const filteredModels = mockModels.filter(model => {
    // 1. Filter by categories
    if (selectedCategories.length > 0) {
      const modelCats = model.categories || (model.category ? [model.category] : []);
      const hasMatch = selectedCategories.some(cat => modelCats.includes(cat));
      if (!hasMatch) return false;
    }
    
    // 3. Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = model.name.toLowerCase().includes(term);
      const modelCats = model.categories || (model.category ? [model.category] : []);
      const matchesCategory = modelCats.some(cat => cat.toLowerCase().includes(term));
      const modelTags = model.features || [];
      const matchesFeature = modelTags.some(tag => tag.toLowerCase().includes(term));
      
      if (!matchesName && !matchesCategory && !matchesFeature) {
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
                className={`category-item ${selectedCategories.length === 0 ? 'active' : ''}`}
                onClick={() => toggleCategory('All Categories')}
              >
                <span>All Categories</span>
              </li>
              {mockCategories.map(cat => (
                <li 
                  key={cat.id} 
                  className={`category-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat.name)}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.name)} 
                      readOnly 
                      style={{cursor: 'pointer'}} 
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="count">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>        </aside>

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
