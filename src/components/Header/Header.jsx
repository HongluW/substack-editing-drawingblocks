import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="back-button">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="draft-indicator">
          <div className="draft-dot"></div>
          <span>Draft</span>
        </div>
      </div>
      <div className="header-right">
        <button className="preview-btn">Preview</button>
        <button className="continue-btn">Continue</button>
      </div>
    </header>
  );
};

export default Header; 