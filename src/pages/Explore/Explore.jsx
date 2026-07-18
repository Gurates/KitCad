import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockModels, categoryTree } from '../../data/mockData';
import './Explore.css';

// Recursive tree node component
const CategoryTreeNode = ({ node, depth, selectedCategories, toggleCategory, expandedNodes, toggleExpand }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.includes(node.name);
  const isSelected = selectedCategories.includes(node.name);
  const isTopLevel = depth === 0;

  // Count models that have this category
  const count = mockModels.filter(m => {
    const cats = m.categories || (m.category ? [m.category] : []);
    return cats.includes(node.name);
  }).length;

  return (
    <li className={`tree-node ${isTopLevel ? 'top-level' : ''}`}>
      <div
        className={`tree-row ${isSelected ? 'selected' : ''} depth-${Math.min(depth, 3)}`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {/* Expand/collapse toggle area */}
        {hasChildren ? (
          <button
            className="tree-toggle"
            onClick={(e) => { e.stopPropagation(); toggleExpand(node.name); }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        ) : (
          <span className="tree-toggle-spacer" />
        )}

        {/* Clickable label area */}
        <div className="tree-label" onClick={() => toggleCategory(node.name)}>
          <span className="tree-checkbox-wrap">
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              tabIndex={-1}
            />
          </span>
          <span className="tree-name">{node.name}</span>
        </div>

        {/* Badge count */}
        {count > 0 && <span className="tree-count">{count}</span>}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul className="tree-branch">
          {node.children.map((child, idx) => (
            <CategoryTreeNode
              key={`${child.name}-${idx}`}
              node={child}
              depth={depth + 1}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Explore = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleCategory = (catName) => {
    setSelectedCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const clearAll = () => setSelectedCategories([]);

  const toggleExpand = (name) => {
    setExpandedNodes(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  // Filter models
  const filteredModels = useMemo(() => mockModels.filter(model => {
    if (selectedCategories.length > 0) {
      const modelCats = model.categories || (model.category ? [model.category] : []);
      const hasMatch = selectedCategories.some(cat => modelCats.includes(cat));
      if (!hasMatch) return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = model.name.toLowerCase().includes(term);
      const modelCats = model.categories || (model.category ? [model.category] : []);
      const matchesCategory = modelCats.some(cat => cat.toLowerCase().includes(term));
      const modelTags = model.features || [];
      const matchesFeature = modelTags.some(tag => tag.toLowerCase().includes(term));
      if (!matchesName && !matchesCategory && !matchesFeature) return false;
    }

    return true;
  }), [selectedCategories, searchTerm]);

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
            <div className="sidebar-header">
              <h3 className="sidebar-title">Categories</h3>
              {selectedCategories.length > 0 && (
                <button className="clear-btn" onClick={clearAll}>
                  Temizle
                </button>
              )}
            </div>
            <ul className="tree-root">
              {categoryTree.map((node, idx) => (
                <CategoryTreeNode
                  key={`${node.name}-${idx}`}
                  node={node}
                  depth={0}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                />
              ))}
            </ul>
          </div>
        </aside>

        <main className="explore-content">
          <div className="models-grid">
            {filteredModels.length > 0 ? (
              filteredModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))
            ) : (
              <div className="no-results">
                Bu filtrelere uygun model bulunamadı.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
