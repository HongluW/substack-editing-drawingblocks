import React from 'react';
import './Footer.css';

const Footer = () => (
  <div className="footer">
    <button className="footer-btn" title="Help">
      <i className="fas fa-question"></i>
    </button>
    <button className="footer-btn" title="Settings">
      <i className="fas fa-cog"></i>
    </button>
  </div>
);

export default Footer;