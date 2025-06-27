import React from 'react';
import CustomDropdown from './CustomDropdown';
import './Toolbar.css';

const styleOptions = [
  { label: 'Style', value: '', icon: <i className="fas fa-font"></i> },
  { label: 'Heading 1', value: 'h1', icon: <i className="fas fa-heading"></i> },
  { label: 'Heading 2', value: 'h2', icon: <i className="fas fa-heading"></i> },
  { label: 'Paragraph', value: 'p', icon: <i className="fas fa-paragraph"></i> },
];

const buttonOptions = [
  { label: 'Button', value: '', icon: <i className="fas fa-square"></i> },
  { label: 'Call to Action', value: 'cta', icon: <i className="fas fa-bullhorn"></i> },
  { label: 'Subscribe', value: 'subscribe', icon: <i className="fas fa-envelope"></i> },
];

const moreOptions = [
  { label: 'Code block', value: 'code', icon: <i className="fas fa-code"></i> },
  { label: 'Divider', value: 'divider', icon: <i className="fas fa-minus"></i> },
  { label: 'Financial chart', value: 'chart', icon: <i className="fas fa-chart-bar"></i> },
  { label: 'Footnote', value: 'footnote', icon: <i className="fas fa-asterisk"></i> },
  { label: 'LaTeX', value: 'latex', icon: <i className="fas fa-superscript"></i> },
  { label: 'Poetry', value: 'poetry', icon: <i className="fas fa-feather-alt"></i> },
  { label: 'Poll', value: 'poll', icon: <i className="fas fa-chart-line"></i> },
  { label: 'Drawings', value: 'Drawings', icon: <i className="fas fa-pen-nib"></i> },
];

const Toolbar = ({ onAddDrawing }) => {
  const handleMoreSelect = (value) => {
    if (value === 'Drawings') {
      onAddDrawing();
    }
    // Handle other options as needed
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn"><i className="fas fa-undo"></i></button>
        <button className="toolbar-btn"><i className="fas fa-redo"></i></button>
      </div>
      <div className="toolbar-separator"></div>
      <CustomDropdown label="Style" options={styleOptions} onSelect={() => {}} />
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
      <CustomDropdown label="Button" options={buttonOptions} onSelect={() => {}} />
      <CustomDropdown label="More" options={moreOptions} onSelect={handleMoreSelect} />
    </div>
  );
};

export default Toolbar;