import React, { useState } from 'react';
import { Search, Filter, ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockModels, categoryTree } from '../../data/mockData';
import './Explore.css';

// Helper: collect all descendant names from a node
const collectNames = (node) => {
  let names = [node.name];
  if (node.children) {
    node.children.forEach(child => {
      names = names.concat(collectNames(child));
    });
  }
  return names;
};

// Recursive tree node component
const CategoryTreeNode = ({ node, depth, selectedCategories, toggleCategory, expandedNodes, toggleExpand }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.includes(node.name);
  const isSelected = selectedCategories.includes(node.name);

  // Count models that have this category
  const count = mockModels.filter(m => {
    const cats = m.categories || (m.category ? [m.category] : []);
    return cats.includes(node.name);
  }).length;

  return (
    <>
      <li
        className={`tree-item ${isSelected ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <div className="tree-item-left" onClick={() => toggleCategory(node.name)}>
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            style={{ cursor: 'pointer', flexShrink: 0 }}
          />
          {hasChildren ? (
            <FolderOpen size={14} className="tree-folder-icon" />
          ) : (
            <Folder size={14} className="tree-folder-icon" />
          )}
          <span className="tree-item-name">{node.name}</span>
        </div>
        <div className="tree-item-right">
          {count > 0 && <span className="count">{count}</span>}
          {hasChildren && (
            <button
              className="tree-expand-btn"
              onClick={(e) => { e.stopPropagation(); toggleExpand(node.name); }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      </li>
      {hasChildren && isExpanded && (
        <ul className="tree-children">
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
    </>
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
  const filteredModels = mockModels.filter(model => {
    // 1. Filter by categories
    if (selectedCategories.length > 0) {
      const modelCats = model.categories || (model.category ? [model.category] : []);
      const hasMatch = selectedCategories.some(cat => modelCats.includes(cat));
      if (!hasMatch) return false;
    }

    // 2. Filter by search term
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
            <div className="sidebar-title-row">
              <h3 className="sidebar-title">Categories</h3>
              {selectedCategories.length > 0 && (
                <button className="clear-filters-btn" onClick={clearAll}>
                  Clear ({selectedCategories.length})
                </button>
              )}
            </div>
            <ul className="category-tree">
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
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No models found matching your filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
