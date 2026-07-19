import React from 'react';
import { Mail, FileBox, Image as ImageIcon, Send } from 'lucide-react';
import './SubmitModel.css';

const SubmitModel = () => {
  return (
    <div className="submit-model-page">
      <div className="container submit-model-container">
        <div className="submit-header">
          <h1 className="submit-title">Submit Your Model</h1>
          <p className="submit-subtitle">
            Want to see your team's creations on KitCAD? We'd love to showcase your work!
          </p>
        </div>

        <div className="submit-content">
          <div className="submit-card">
            <div className="submit-steps">
              <div className="step-item">
                <div className="step-icon">
                  <FileBox size={24} />
                </div>
                <div className="step-details">
                  <h3>1. Prepare Your Files</h3>
                  <p>Gather your 3D model files (only .step format is accepted) and ensure they are properly optimized.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon">
                  <ImageIcon size={24} />
                </div>
                <div className="step-details">
                  <h3>2. Take a Screenshot</h3>
                  <p>Take one clear, high-quality preview image of your model.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon">
                  <Send size={24} />
                </div>
                <div className="step-details">
                  <h3>3. Send to Us</h3>
                  <p>Email your files and images to our team, along with a title and description for your model.</p>
                </div>
              </div>
            </div>

            <div className="email-section">
              <div className="email-box">
                <Mail className="email-icon" size={32} />
                <h2 className="email-title">Contact Our Team</h2>
                <p className="email-desc">Send your submission to:</p>
                <a href="mailto:uselesscase9021@gmail.com" className="email-link">uselesscase9021@gmail.com</a>
                <p className="email-note">We will review your submission and add it to our platform as soon as possible.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModel;
