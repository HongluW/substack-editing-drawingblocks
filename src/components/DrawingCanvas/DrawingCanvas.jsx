import React from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = ({ id, canvasData, onClick }) => {
  return (
    <div className="drawing-canvas-container" onClick={() => onClick(id)}>
      <div className="drawing-canvas-placeholder">
        {canvasData ? (
          <img src={canvasData} alt="Drawing" className="drawing-preview" />
        ) : (
          <div className="drawing-empty">
            <i className="fas fa-paint-brush"></i>
            <span>Click to start drawing</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas; 