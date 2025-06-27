import React, { useRef, useEffect, useState } from 'react';
import './DrawingPopup.css';

const DrawingPopup = ({ isOpen, onClose, onSave, initialData }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Get the container dimensions
      const container = canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate available space (accounting for padding)
      const availableWidth = containerRect.width - 48; // 24px padding on each side
      const availableHeight = containerRect.height - 32; // 16px padding on each side
      
      // Set canvas size to fit within available space while maintaining aspect ratio
      const maxCanvasWidth = Math.min(800, availableWidth);
      const maxCanvasHeight = Math.min(600, availableHeight);
      
      // Maintain aspect ratio (4:3)
      const aspectRatio = 4 / 3;
      let canvasWidth = maxCanvasWidth;
      let canvasHeight = canvasWidth / aspectRatio;
      
      if (canvasHeight > maxCanvasHeight) {
        canvasHeight = maxCanvasHeight;
        canvasWidth = canvasHeight * aspectRatio;
      }
      
      // Set canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Fill with background color
      ctx.fillStyle = canvasBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load initial data if exists
      if (initialData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = initialData;
      } else if (uploadedImage) {
        // Draw uploaded image
        const img = new Image();
        img.onload = () => {
          // Calculate dimensions to fit image in canvas while maintaining aspect ratio
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = canvas.width / canvas.height;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspectRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Image is taller than canvas
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };
        img.src = uploadedImage;
      }
    }
  }, [isOpen, initialData, canvasBackgroundColor, uploadedImage]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && canvasRef.current) {
        // Trigger a re-render by updating a state
        // This will cause the above useEffect to run again
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Get the container dimensions
        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate available space (accounting for padding)
        const availableWidth = containerRect.width - 48;
        const availableHeight = containerRect.height - 32;
        
        // Set canvas size to fit within available space while maintaining aspect ratio
        const maxCanvasWidth = Math.min(800, availableWidth);
        const maxCanvasHeight = Math.min(600, availableHeight);
        
        // Maintain aspect ratio (4:3)
        const aspectRatio = 4 / 3;
        let canvasWidth = maxCanvasWidth;
        let canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > maxCanvasHeight) {
          canvasHeight = maxCanvasHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
        
        // Set canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Fill with background color
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Redraw uploaded image if exists
        if (uploadedImage) {
          const img = new Image();
          img.onload = () => {
            // Calculate dimensions to fit image in canvas while maintaining aspect ratio
            const imgAspectRatio = img.width / img.height;
            const canvasAspectRatio = canvas.width / canvas.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspectRatio > canvasAspectRatio) {
              // Image is wider than canvas
              drawWidth = canvas.width;
              drawHeight = canvas.width / imgAspectRatio;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
            } else {
              // Image is taller than canvas
              drawHeight = canvas.height;
              drawWidth = canvas.height * imgAspectRatio;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
            }
            
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          };
          img.src = uploadedImage;
        }
      }
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isOpen, canvasBackgroundColor, uploadedImage]);

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
    if (uploadedImage) {
      // Show confirmation dialog when image is uploaded
      setShowClearDialog(true);
    } else {
      // Clear everything if no image
      clearEverything();
    }
  };

  const clearEverything = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUploadedImage(null);
    setErrorMessage('');
    setShowClearDialog(false);
  };

  const clearDrawingsOnly = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear to background color
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the uploaded image
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions to fit image in canvas while maintaining aspect ratio
        const imgAspectRatio = img.width / img.height;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspectRatio > canvasAspectRatio) {
          // Image is wider than canvas
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          // Image is taller than canvas
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };
      img.src = uploadedImage;
    }
    
    setShowClearDialog(false);
  };

  const changeCanvasBackground = (newColor) => {
    setCanvasBackgroundColor(newColor);
  };

  const clearError = () => {
    setErrorMessage('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image and has a supported format
      const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      
      if (supportedFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
          setErrorMessage(''); // Clear any previous error
        };
        reader.readAsDataURL(file);
      } else {
        setErrorMessage(`File format not supported. Please use: ${supportedFormats.map(f => f.replace('image/', '')).join(', ')}`);
        // Clear the file input
        event.target.value = '';
      }
    }
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
          <h3>Canvas</h3>
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
            <label>Background:</label>
            <input 
              type="color" 
              value={canvasBackgroundColor} 
              onChange={(e) => changeCanvasBackground(e.target.value)}
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
          
          <div className="tool-group">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="upload-btn" 
              onClick={() => fileInputRef.current.click()}
            >
              <i className="fas fa-image"></i>
            </button>
          </div>
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
        
        {/* Error Popup */}
        {errorMessage && (
          <div className="error-popup-overlay">
            <div className="error-popup">
              <div className="error-popup-header">
                <h4>Unsupported File Format</h4>
                <button className="close-btn" onClick={clearError}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="error-popup-content">
                <p>{errorMessage}</p>
              </div>
              <div className="error-popup-footer">
                <button className="ok-btn" onClick={clearError}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Clear Confirmation Dialog */}
        {showClearDialog && (
          <div className="error-popup-overlay">
            <div className="error-popup">
              <div className="error-popup-header">
                <h4>Clear Canvas</h4>
                <button className="close-btn" onClick={() => setShowClearDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="error-popup-content">
                <p>You have an image uploaded. What would you like to clear?</p>
              </div>
              <div className="error-popup-footer">
                <button className="cancel-btn" onClick={() => setShowClearDialog(false)}>
                  Cancel
                </button>
                <button className="clear-drawings-btn" onClick={clearDrawingsOnly}>
                  Clear Drawings Only
                </button>
                <button className="clear-all-btn" onClick={clearEverything}>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
        
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