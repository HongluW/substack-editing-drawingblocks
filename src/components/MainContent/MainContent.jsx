import React, { useState } from 'react';
import DrawingCanvas from '../DrawingCanvas/DrawingCanvas';
import DrawingPopup from '../DrawingPopup/DrawingPopup';
import './MainContent.css';

const MainContent = ({ onAddDrawing }) => {
  const [authors, setAuthors] = useState(['Honglu Wang']);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [drawingBlocks, setDrawingBlocks] = useState([]);
  const [showDrawingPopup, setShowDrawingPopup] = useState(false);
  const [currentDrawingId, setCurrentDrawingId] = useState(null);

  const removeAuthor = (name) => {
    setAuthors(authors.filter(a => a !== name));
  };

  const addAuthor = () => {
    const name = prompt('Enter author name:');
    if (name && !authors.includes(name)) setAuthors([...authors, name]);
  };

  const addDrawingBlock = () => {
    const newId = Date.now().toString();
    setDrawingBlocks([...drawingBlocks, { id: newId, data: null }]);
  };

  const openDrawingEditor = (drawingId) => {
    setCurrentDrawingId(drawingId);
    setShowDrawingPopup(true);
  };

  const saveDrawing = (drawingData) => {
    setDrawingBlocks(drawingBlocks.map(block => 
      block.id === currentDrawingId 
        ? { ...block, data: drawingData }
        : block
    ));
  };

  const closeDrawingPopup = () => {
    setShowDrawingPopup(false);
    setCurrentDrawingId(null);
  };

  // Expose addDrawingBlock to parent component
  React.useEffect(() => {
    if (onAddDrawing) {
      // Replace the onAddDrawing prop with our addDrawingBlock function
      window.addDrawingBlock = addDrawingBlock;
    }
  }, [onAddDrawing]);

  const currentDrawingData = currentDrawingId 
    ? drawingBlocks.find(block => block.id === currentDrawingId)?.data 
    : null;

  return (
    <main className="main-content">
      <a href="#" className="email-header-link">
        <span>Edit email header / footer</span>
        <i className="fas fa-chevron-right"></i>
      </a>
      <div className="title-section">
        <textarea
          className="title-input"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          rows={1}
        />
        <textarea
          className="subtitle-input"
          placeholder="Add a subtitle..."
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          rows={1}
        />
      </div>
      <div className="author-section">
        <div className="author-tags">
          {authors.map(name => (
            <div className="author-tag" key={name}>
              <span>{name}</span>
              <button className="remove-author" onClick={() => removeAuthor(name)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          <button className="add-author" onClick={addAuthor}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <textarea
        className="content-editor"
        placeholder="Start writing..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={8}
      />
      
      {drawingBlocks.map(block => (
        <DrawingCanvas
          key={block.id}
          id={block.id}
          canvasData={block.data}
          onClick={openDrawingEditor}
        />
      ))}
      
      <DrawingPopup
        isOpen={showDrawingPopup}
        onClose={closeDrawingPopup}
        onSave={saveDrawing}
        initialData={currentDrawingData}
      />
    </main>
  );
};

export default MainContent;