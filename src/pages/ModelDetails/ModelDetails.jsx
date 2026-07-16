import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Download, Share2, Box } from 'lucide-react';
import '@google/model-viewer'; // Import 3D viewer
import { mockModels } from '../../data/mockData';
import './ModelDetails.css';

const ModelDetails = () => {
  const { id } = useParams();
  const model = mockModels.find(m => m.id === id);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!model.rawUrl) {
      alert("No STEP file available for download.");
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(model.rawUrl);
      if (!response.ok) throw new Error("Failed to fetch model file.");
      const blob = await response.blob();

      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Extract step filename from URL or build one
      const ext = model.rawUrl.endsWith('.step') ? '.step' : (model.rawUrl.endsWith('.stp') ? '.stp' : '.step');
      const filename = `${model.name.toLowerCase().replace(/\s+/g, '_')}_model${ext}`;
      zip.file(filename, blob);

      const readmeContent = `KitCAD Model: ${model.name}
Team: ${model.teamNumber || 'Unknown'} | ${model.teamName || 'Unknown'}
Uploaded on: ${model.uploadDate}

This STEP model is provided by KitCAD, the CAD platform for the FRC Community.
Find more models at ${window.location.origin}`;

      zip.file('README.txt', readmeContent);

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${model.name.toLowerCase().replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Error downloading file: " + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link: ", err);
      });
  };

  if (!model) {
    return (
      <div className="model-details container" style={{ padding: 'var(--spacing-12) 0', textAlign: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: 'var(--spacing-4)' }}>Model Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-6)' }}>The model you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="model-details container">
      <div className="model-details-header">
        <h1 className="page-title">{model.name}</h1>
      </div>

      <div className="model-details-content">
        <div className="model-main">
          {/* 3D Viewer */}
          <div className="model-viewer card">
            {model.glbUrl ? (
              <model-viewer
                src={model.glbUrl}
                alt={model.name}
                auto-rotate
                camera-controls
                shadow-intensity="1"
                style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-background)' }}
              ></model-viewer>
            ) : (
              <>
                <div className="viewer-placeholder">
                  <Box size={48} className="viewer-icon" />
                  <p>Interactive 3D Viewer</p>
                  <span className="viewer-hint">Drag to rotate, scroll to zoom</span>
                </div>
                <img src={model.thumbnail} alt={model.name} className="viewer-fallback-img" />
              </>
            )}
          </div>

          {model.features && model.features.length > 0 && (
            <div className="model-features card" style={{ marginTop: 'var(--spacing-6)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-text-main)' }}>Features</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>
                {model.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: 'var(--spacing-2)' }}>{feature}</li>
                ))}
              </ul>
            </div>
          )}




        </div>

        <aside className="model-sidebar">
          <div className="action-card card">
            <button className="btn btn-primary btn-full download-btn" onClick={handleDownload} disabled={downloading}>
              <Download size={18} /> {downloading ? 'Preparing ZIP...' : 'Download Files'}
            </button>
            <div className="action-buttons">

              <button className="btn btn-outline btn-full" onClick={handleShare}>
                <Share2 size={18} /> {copied ? 'Copied Link!' : 'Share'}
              </button>
            </div>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Downloads</span>
                <span className="stat-value">{model.downloads}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">File Size</span>
                <span className="stat-value">24.5 MB</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Format</span>
                <span className="stat-value">STEP, SLDPRT</span>
              </div>
            </div>
          </div>


        </aside>
      </div>
    </div>
  );
};

export default ModelDetails;
