import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileUp, Lock, RefreshCw } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { mockModels } from '../../data/mockData';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [modelName, setModelName] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [category, setCategory] = useState('MEKANİK');
  const [features, setFeatures] = useState('');
  const [selectedThumbFile, setSelectedThumbFile] = useState(null);
  const [selectedStepFile, setSelectedStepFile] = useState(null);
  const [selectedGlbFile, setSelectedGlbFile] = useState(null);

  // Upload Pipeline State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'uploading', 'success'
  const [progress, setProgress] = useState(0);

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
        category,
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
    setCategory('MEKANİK');
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
                  <label>Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isUploading}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-main)' }}
                  >
                    <option value="MEKANİK">MEKANİK</option>
                    <option value="HAZIR MEKANİZMALAR">HAZIR MEKANİZMALAR</option>
                    <option value="ELEKTRONİK">ELEKTRONİK</option>
                  </select>
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
          <div className="info-card card">
            <h3>Pipeline Info</h3>
            <ul className="info-list">
              <li><strong>Storage:</strong> Cloudflare R2</li>
              <li><strong>Format:</strong> Raw CAD + GLB</li>
              <li><strong>Max Size:</strong> 500MB per file</li>
              <li><strong>Visibility:</strong> Public instantly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
