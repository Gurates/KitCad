import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import '@google/model-viewer';
import { downloadService } from '../../services/DownloadService';
import './ModelCard.css';

const ModelCard = ({ model }) => {
  const [downloads, setDownloads] = React.useState(model.downloads || 0);

  React.useEffect(() => {
    downloadService.getCount(model.id).then(count => {
      if (count > 0) setDownloads(count);
    });
  }, [model.id]);

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="model-card card">
      <Link to={`/model/${model.id}`} className="model-card-link">
        <div className="model-thumbnail-wrapper">
          <img src={model.thumbnail || 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'} alt={model.name} className="model-thumbnail" />
        </div>
      </Link>
      <div className="model-info">
        <Link to={`/model/${model.id}`} className="model-name-link">
          <h3 className="model-name" title={model.name}>{model.name}</h3>
        </Link>
        <p className="model-team">
          <span className="team-link">
            {model.teamNumber} | {model.teamName}
          </span>
        </p>
        <div className="model-footer">
          <div className="model-stats">
            <span className="stat"><Download size={14} /> {downloads}</span>
          </div>
          <span className="model-date">{new Date(model.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
