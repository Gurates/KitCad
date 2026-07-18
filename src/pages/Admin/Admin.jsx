import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileUp, Lock, RefreshCw } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { mockModels, allCategoryNames, categoryTree } from '../../data/mockData';
import { downloadService } from '../../services/DownloadService';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [modelName, setModelName] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState('');
  const [selectedThumbFile, setSelectedThumbFile] = useState(null);
  const [selectedStepFile, setSelectedStepFile] = useState(null);
  const [selectedGlbFile, setSelectedGlbFile] = useState(null);

  // Upload Pipeline State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'uploading', 'success'
  const [progress, setProgress] = useState(0);

  // Download Counts State
  const [downloadCounts, setDownloadCounts] = useState({});
  const [totalDownloads, setTotalDownloads] = useState(0);

  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchAllCounts = async () => {
        const counts = {};
        for (const model of mockModels) {
          const count = await downloadService.getCount(model.id);
          counts[model.id] = count;
        }
        setDownloadCounts(counts);

        const total = await downloadService.getTotalDownloads();
        setTotalDownloads(total);
      };
      fetchAllCounts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleStepChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedStepFile(e.target.files[0]);
  };
  
  const handleGlbChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedGlbFile(e.target.files[0]);
  };

  const handleThumbChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedThumbFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGlbFile || !modelName || !teamNumber) {
      alert('Please fill required fields and provide at least the GLB file.');
      return;
    }

    setIsUploading(true);
    
    try {
      setUploadStatus('uploading');
      setProgress(0);
      
      const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);

      // Call local uploader plugin
      await storageService.localUpload(
        modelName, 
        teamNumber, 
        categories,
        featuresArray,
        selectedThumbFile,
        selectedStepFile, 
        selectedGlbFile, 
        (p) => setProgress(p)
      );

      setUploadStatus('success');

    } catch (err) {
      console.error(err);
      alert('An error occurred during local upload: ' + err.message);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setModelName('');
    setTeamNumber('');
    setCategories([]);
    setFeatures('');
    setSelectedStepFile(null);
    setSelectedGlbFile(null);
    setSelectedThumbFile(null);
    setIsUploading(false);
    setUploadStatus('');
    setProgress(0);
    // Force reload page to see changes in UI from mockData updates
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card card">
          <div className="admin-login-header">
            <Lock size={32} className="admin-icon" />
            <h2>Local Admin Portal</h2>
            <p>Password to inject files into project.</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Password (hint: admin123)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1 className="page-title">Local Model Uploader</h1>
        <p className="page-subtitle">Files will be physically saved to <code>public/models</code> folder and added to <code>mockData.js</code>.</p>
      </div>

      <div className="admin-content">
        <div className="upload-card card">
          {uploadStatus === 'success' ? (
            <div className="success-state">
              <CheckCircle size={64} className="success-icon" />
              <h2>Successfully Written!</h2>
              <p>Model files are saved to the project. Click below to refresh the page and see it.</p>
              <button onClick={resetForm} className="btn btn-primary">Refresh & Upload Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label>Model Name</label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Swerve Drive Module Mk4i"
                  disabled={isUploading}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Team Number</label>
                  <input 
                    type="text" 
                    value={teamNumber}
                    onChange={(e) => setTeamNumber(e.target.value)}
                    placeholder="e.g. 254"
                    disabled={isUploading}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Categories (Select multiple)</label>
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    backgroundColor: 'var(--color-background-alt)'
                  }}>
                    {(() => {
                      const renderTree = (nodes, depth = 0) => {
                        return nodes.map((node, idx) => (
                          <React.Fragment key={`${node.name}-${idx}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', paddingLeft: `${depth * 16}px` }}>
                              <input
                                type="checkbox"
                                checked={categories.includes(node.name)}
                                onChange={() => {
                                  setCategories(prev =>
                                    prev.includes(node.name)
                                      ? prev.filter(c => c !== node.name)
                                      : [...prev, node.name]
                                  );
                                }}
                                disabled={isUploading}
                                style={{ cursor: 'pointer' }}
                              />
                              <span style={{ cursor: 'pointer', margin: 0, fontSize: '0.85rem' }}>
                                {node.name}
                              </span>
                            </div>
                            {node.children && renderTree(node.children, depth + 1)}
                          </React.Fragment>
                        ));
                      };
                      return renderTree(categoryTree);
                    })()}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Features (comma separated)</label>
                  <input 
                    type="text" 
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="e.g. Robust, Custom intake, Dual motor"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Original CAD (STEP/ZIP) <small>- Optional</small></label>
                  <div className={`file-drop-area ${selectedStepFile ? 'has-file' : ''}`}>
                    <input 
                      type="file" 
                      onChange={handleStepChange}
                      disabled={isUploading}
                      accept=".step,.stp,.sldprt,.sldasm,.zip"
                      className="file-input"
                    />
                    <div className="file-drop-message">
                      {selectedStepFile ? (
                        <>
                          <FileUp size={32} className="file-icon active" />
                          <span className="file-name">{selectedStepFile.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="file-icon" />
                          <span>Select Raw CAD</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Thumbnail Image (PNG/JPG)</label>
                  <div className={`file-drop-area ${selectedThumbFile ? 'has-file' : ''}`}>
                    <input 
                      type="file" 
                      onChange={handleThumbChange}
                      disabled={isUploading}
                      accept=".png,.jpg,.jpeg,.webp"
                      className="file-input"
                    />
                    <div className="file-drop-message">
                      {selectedThumbFile ? (
                        <>
                          <FileUp size={32} className="file-icon active" />
                          <span className="file-name">{selectedThumbFile.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="file-icon" />
                          <span>Select Thumbnail</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Web 3D Viewer (GLB) <small>- Required</small></label>
                  <div className={`file-drop-area ${selectedGlbFile ? 'has-file' : ''}`}>
                    <input 
                      type="file" 
                      onChange={handleGlbChange}
                      disabled={isUploading}
                      accept=".glb,.gltf"
                      className="file-input"
                    />
                    <div className="file-drop-message">
                      {selectedGlbFile ? (
                        <>
                          <FileUp size={32} className="file-icon active" />
                          <span className="file-name">{selectedGlbFile.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="file-icon" />
                          <span>Select GLB file</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="upload-progress-container">
                  <div className="progress-status">
                    <span><RefreshCw size={16} className="spin"/> Writing files to public folder...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-full upload-submit-btn"
                disabled={isUploading || !selectedGlbFile || !modelName || !teamNumber}
              >
                {isUploading ? 'Writing to Disk...' : 'Save to Project'}
              </button>
            </form>
          )}
        </div>

        <div className="admin-info-sidebar">
          <div className="info-card card" style={{ marginBottom: 'var(--spacing-4)' }}>
            <h3>Pipeline Info</h3>
            <ul className="info-list">
              <li><strong>Storage:</strong> Cloudflare R2</li>
              <li><strong>Format:</strong> Raw CAD + GLB</li>
              <li><strong>Max Size:</strong> 500MB per file</li>
              <li><strong>Visibility:</strong> Public instantly</li>
            </ul>
          </div>

          <div className="info-card card">
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Model Downloads
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                Total: {totalDownloads}
              </span>
            </h3>
            <ul className="info-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {mockModels.map((model) => (
                <li key={model.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }} title={model.name}>
                    {model.name}
                  </span>
                  <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {downloadCounts[model.id] !== undefined ? downloadCounts[model.id] : '...'} downloads
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
