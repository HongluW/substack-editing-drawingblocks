import React, { useRef, useEffect, useState } from 'react';
import './DrawingPopup.css';

const DrawingPopup = ({ isOpen, onClose, onSave, initialData }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load initial data if exists
      if (initialData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = initialData;
      }
    }
  }, [isOpen, initialData]);

  const startDrawing = (e) => {
    if (currentTool === 'pen' || currentTool === 'eraser') {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    
    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    onSave(dataURL);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="drawing-popup-overlay">
      <div className="drawing-popup">
        <div className="drawing-popup-header">
          <h3>Drawing Editor</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="drawing-toolbar">
          <div className="tool-group">
            <button 
              className={`tool-btn ${currentTool === 'pen' ? 'active' : ''}`}
              onClick={() => setCurrentTool('pen')}
            >
              <i className="fas fa-pen"></i>
            </button>
            <button 
              className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`}
              onClick={() => setCurrentTool('eraser')}
            >
              <i className="fas fa-eraser"></i>
            </button>
          </div>
          
          <div className="tool-group">
            <label>Color:</label>
            <input 
              type="color" 
              value={currentColor} 
              onChange={(e) => setCurrentColor(e.target.value)}
              className="color-picker"
            />
          </div>
          
          <div className="tool-group">
            <label>Size:</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={currentSize} 
              onChange={(e) => setCurrentSize(e.target.value)}
              className="size-slider"
            />
            <span>{currentSize}px</span>
          </div>
          
          <button className="clear-btn" onClick={clearCanvas}>
            Clear
          </button>
        </div>
        
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="drawing-canvas"
          />
        </div>
        
        <div className="drawing-popup-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Drawing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingPopup; 