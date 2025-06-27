import React from 'react';
import './Toolbar.css';

const Toolbar = ({ onAddDrawing }) => {
  const handleMoreChange = (e) => {
    if (e.target.value === 'Drawings') {
      onAddDrawing();
      e.target.value = 'More'; // Reset dropdown
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn"><i className="fas fa-undo"></i></button>
        <button className="toolbar-btn"><i className="fas fa-redo"></i></button>
      </div>
      <div className="toolbar-separator"></div>
      <select className="style-dropdown">
        <option>Style</option>
        <option>Heading 1</option>
        <option>Heading 2</option>
        <option>Paragraph</option>
      </select>
      <div className="toolbar-separator"></div>
      <div className="toolbar-group">
        <button className="toolbar-btn"><i className="fas fa-bold"></i></button>
        <button className="toolbar-btn"><i className="fas fa-italic"></i></button>
        <button className="toolbar-btn"><i className="fas fa-underline"></i></button>
        <button className="toolbar-btn"><i className="fas fa-strikethrough"></i></button>
        <button className="toolbar-btn"><i className="fas fa-code"></i></button>
      </div>
      <div className="toolbar-separator"></div>
      <div className="toolbar-group">
        <button className="toolbar-btn"><i className="fas fa-link"></i></button>
        <button className="toolbar-btn"><i className="fas fa-image"></i></button>
        <button className="toolbar-btn"><i className="fas fa-video"></i></button>
        <button className="toolbar-btn"><i className="fas fa-volume-up"></i></button>
        <button className="toolbar-btn"><i className="fas fa-code"></i></button>
      </div>
      <div className="toolbar-separator"></div>
      <div className="toolbar-group">
        <button className="toolbar-btn"><i className="fas fa-list-ul"></i></button>
        <button className="toolbar-btn"><i className="fas fa-list-ol"></i></button>
      </div>
      <div className="toolbar-separator"></div>
      <select className="button-dropdown">
        <option>Button</option>
        <option>Call to Action</option>
        <option>Subscribe</option>
      </select>
      <select className="more-dropdown" onChange={handleMoreChange}>
        <option>More</option>
        <option>Table</option>
        <option>Divider</option>
        <option>Drawings</option>
      </select>
    </div>
  );
};

export default Toolbar;