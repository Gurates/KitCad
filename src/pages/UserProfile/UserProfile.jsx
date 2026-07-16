import React, { useState } from 'react';
import { Settings, Bookmark, UploadCloud } from 'lucide-react';
import ModelCard from '../../components/model/ModelCard';
import { mockUser, mockModels } from '../../data/mockData';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('saved');

  return (
    <div className="user-profile container">
      <div className="user-header card">
        <div className="user-info">
          <img src={mockUser.avatar} alt={mockUser.username} className="user-avatar" />
          <div className="user-details">
            <h1 className="username">{mockUser.username}</h1>
            <p className="user-role">FRC Designer</p>
          </div>
        </div>
        <button className="btn btn-outline settings-btn">
          <Settings size={18} /> Edit Profile
        </button>
      </div>

      <div className="user-content">
        <div className="user-tabs">
          <button 
            className={`user-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={18} /> Saved ({mockUser.stats.saved})
          </button>

          <button 
            className={`user-tab ${activeTab === 'uploaded' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploaded')}
          >
            <UploadCloud size={18} /> Uploads ({mockUser.stats.uploaded})
          </button>
        </div>

        <div className="tab-content">
          <div className="models-grid">
            {mockModels.slice(1, 5).map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
