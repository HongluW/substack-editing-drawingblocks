import React, { useState, useRef } from 'react';
import DrawingCanvas from '../DrawingCanvas/DrawingCanvas';
import DrawingPopup from '../DrawingPopup/DrawingPopup';
import './MainContent.css';

const MainContent = ({ onAddDrawing }) => {
  const [authors, setAuthors] = useState(['Honglu Wang']);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [contentBlocks, setContentBlocks] = useState([
    { id: 'text-1', type: 'text', content: '', focused: false }
  ]);
  const [showDrawingPopup, setShowDrawingPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentDrawingId, setCurrentDrawingId] = useState(null);
  const [drawingToDelete, setDrawingToDelete] = useState(null);
  const [highlightedDrawingId, setHighlightedDrawingId] = useState(null);
  const [focusedBlockId, setFocusedBlockId] = useState('text-1');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRefs = useRef({});

  const removeAuthor = (name) => {
    setAuthors(authors.filter(a => a !== name));
  };

  const addAuthor = () => {
    const name = prompt('Enter author name:');
    if (name && !authors.includes(name)) setAuthors([...authors, name]);
  };

  const addDrawingBlock = () => {
    const focusedBlock = contentBlocks.find(block => block.id === focusedBlockId);
    if (!focusedBlock || focusedBlock.type !== 'text') return;

    const textarea = textareaRefs.current[focusedBlockId];
    const currentCursorPos = textarea ? textarea.selectionStart : 0;
    const textContent = focusedBlock.content;

    // Split the text at cursor position
    const beforeCursor = textContent.substring(0, currentCursorPos);
    const afterCursor = textContent.substring(currentCursorPos);

    const drawingId = `drawing-${Date.now()}`;
    const newTextId = `text-${Date.now()}`;

    // Find the index of the focused block
    const focusedIndex = contentBlocks.findIndex(block => block.id === focusedBlockId);

    // Create new blocks array
    const newBlocks = [...contentBlocks];
    
    // Replace the focused block with up to 3 new blocks
    const replacementBlocks = [];
    
    // Add text before cursor (if exists)
    if (beforeCursor) {
      replacementBlocks.push({
        id: focusedBlockId,
        type: 'text',
        content: beforeCursor,
        focused: false
      });
    }
    
    // Add drawing block
    replacementBlocks.push({
      id: drawingId,
      type: 'drawing',
      data: null
    });
    
    // Add text after cursor (always, even if empty)
    replacementBlocks.push({
      id: newTextId,
      type: 'text',
      content: afterCursor,
      focused: true
    });

    // Replace the focused block with the new blocks
    newBlocks.splice(focusedIndex, 1, ...replacementBlocks);
    
    setContentBlocks(newBlocks);
    setFocusedBlockId(newTextId);

    // Focus the new text block after drawing
    setTimeout(() => {
      const newTextarea = textareaRefs.current[newTextId];
      if (newTextarea) {
        newTextarea.focus();
        newTextarea.setSelectionRange(0, 0);
      }
    }, 0);
  };

  const openDrawingEditor = (drawingId) => {
    setCurrentDrawingId(drawingId);
    setShowDrawingPopup(true);
  };

  const saveDrawing = (drawingData) => {
    setContentBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === currentDrawingId
          ? { ...block, data: drawingData }
          : block
      )
    );
  };

  const closeDrawingPopup = () => {
    setShowDrawingPopup(false);
    setCurrentDrawingId(null);
  };

  const deleteCurrentDrawingBlock = () => {
    if (!currentDrawingId) return;
    
    const blockIndex = contentBlocks.findIndex(block => block.id === currentDrawingId);
    const newBlocks = [...contentBlocks];
    
    // Remove the drawing block
    newBlocks.splice(blockIndex, 1);
    
    // If there are text blocks before and after, merge them
    const prevBlock = newBlocks[blockIndex - 1];
    const nextBlock = newBlocks[blockIndex];
    
    if (prevBlock && nextBlock && prevBlock.type === 'text' && nextBlock.type === 'text') {
      const mergedContent = prevBlock.content + nextBlock.content;
      newBlocks[blockIndex - 1] = {
        ...prevBlock,
        content: mergedContent,
        focused: true
      };
      newBlocks.splice(blockIndex, 1);
      setFocusedBlockId(prevBlock.id);
    } else if (nextBlock && nextBlock.type === 'text') {
      setFocusedBlockId(nextBlock.id);
    } else if (prevBlock && prevBlock.type === 'text') {
      setFocusedBlockId(prevBlock.id);
    }
    
    setContentBlocks(newBlocks);
    setShowDrawingPopup(false);
    setCurrentDrawingId(null);
    
    // Focus the appropriate text block
    setTimeout(() => {
      const textarea = textareaRefs.current[focusedBlockId];
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  const handleTextChange = (blockId, newContent) => {
    setContentBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? { ...block, content: newContent }
          : block
      )
    );
  };

  const handleTextFocus = (blockId) => {
    setFocusedBlockId(blockId);
  };

  const handleKeyDown = (e, blockId) => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    // Handle Enter key to create new text block
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      
      const cursorPos = textarea.selectionStart;
      const textContent = textarea.value;
      const beforeCursor = textContent.substring(0, cursorPos);
      const afterCursor = textContent.substring(cursorPos);

      const newTextId = `text-${Date.now()}`;
      const blockIndex = contentBlocks.findIndex(block => block.id === blockId);

      const newBlocks = [...contentBlocks];
      
      // Update current block with text before cursor
      newBlocks[blockIndex] = {
        ...newBlocks[blockIndex],
        content: beforeCursor
      };
      
      // Insert new block with text after cursor
      newBlocks.splice(blockIndex + 1, 0, {
        id: newTextId,
        type: 'text',
        content: afterCursor,
        focused: true
      });

      setContentBlocks(newBlocks);
      setFocusedBlockId(newTextId);

      setTimeout(() => {
        const newTextarea = textareaRefs.current[newTextId];
        if (newTextarea) {
          newTextarea.focus();
          newTextarea.setSelectionRange(0, 0);
        }
      }, 0);
    }

    // Handle Backspace key for character deletion and block merging
    if (e.key === 'Backspace') {
      const cursorPos = textarea.selectionStart;
      const textContent = textarea.value;
      
      // If at the beginning of a text block and there's a previous block
      if (cursorPos === 0) {
        const blockIndex = contentBlocks.findIndex(block => block.id === blockId);
        const prevBlock = contentBlocks[blockIndex - 1];
        
        if (prevBlock) {
          e.preventDefault();
          
          if (prevBlock.type === 'text') {
            // Merge with previous text block
            const newContent = prevBlock.content + textContent;
            const newBlocks = [...contentBlocks];
            
            // Update previous block with merged content
            newBlocks[blockIndex - 1] = {
              ...prevBlock,
              content: newContent,
              focused: true
            };
            
            // Remove current block
            newBlocks.splice(blockIndex, 1);
            
            setContentBlocks(newBlocks);
            setFocusedBlockId(prevBlock.id);
            setHighlightedDrawingId(null); // Clear any highlighting
            
            // Focus the merged block at the right position
            setTimeout(() => {
              const mergedTextarea = textareaRefs.current[prevBlock.id];
              if (mergedTextarea) {
                const newCursorPos = prevBlock.content.length;
                mergedTextarea.focus();
                mergedTextarea.setSelectionRange(newCursorPos, newCursorPos);
              }
            }, 0);
          } else if (prevBlock.type === 'drawing') {
            // Two-step deletion for drawing blocks
            if (highlightedDrawingId === prevBlock.id) {
              // Second backspace - show delete confirmation
              setDrawingToDelete(prevBlock);
              setShowDeletePopup(true);
              setHighlightedDrawingId(null);
            } else {
              // First backspace - highlight the drawing block
              setHighlightedDrawingId(prevBlock.id);
            }
          }
        }
      } else {
        // If not at the beginning, clear any highlighting
        setHighlightedDrawingId(null);
      }
    }

    // Handle Delete key for drawing block deletion
    if (e.key === 'Delete') {
      const cursorPos = textarea.selectionStart;
      const textContent = textarea.value;
      
      // If at the end of a text block and there's a next block
      if (cursorPos === textContent.length) {
        const blockIndex = contentBlocks.findIndex(block => block.id === blockId);
        const nextBlock = contentBlocks[blockIndex + 1];
        
        if (nextBlock && nextBlock.type === 'drawing') {
          e.preventDefault();
          setDrawingToDelete(nextBlock);
          setShowDeletePopup(true);
        }
      }
    }
  };

  const deleteDrawingBlock = () => {
    if (!drawingToDelete) return;
    
    const blockIndex = contentBlocks.findIndex(block => block.id === drawingToDelete.id);
    const newBlocks = [...contentBlocks];
    
    // Remove the drawing block
    newBlocks.splice(blockIndex, 1);
    
    // If there are text blocks before and after, merge them
    const prevBlock = newBlocks[blockIndex - 1];
    const nextBlock = newBlocks[blockIndex];
    
    if (prevBlock && nextBlock && prevBlock.type === 'text' && nextBlock.type === 'text') {
      const mergedContent = prevBlock.content + nextBlock.content;
      newBlocks[blockIndex - 1] = {
        ...prevBlock,
        content: mergedContent,
        focused: true
      };
      newBlocks.splice(blockIndex, 1);
      setFocusedBlockId(prevBlock.id);
    } else if (nextBlock && nextBlock.type === 'text') {
      setFocusedBlockId(nextBlock.id);
    } else if (prevBlock && prevBlock.type === 'text') {
      setFocusedBlockId(prevBlock.id);
    }
    
    setContentBlocks(newBlocks);
    setShowDeletePopup(false);
    setDrawingToDelete(null);
    setHighlightedDrawingId(null); // Clear highlighting
    
    // Focus the appropriate text block
    setTimeout(() => {
      const textarea = textareaRefs.current[focusedBlockId];
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  const cancelDeleteDrawing = () => {
    setShowDeletePopup(false);
    setDrawingToDelete(null);
    setHighlightedDrawingId(null); // Clear highlighting
  };

  // Expose addDrawingBlock to parent component
  React.useEffect(() => {
    if (onAddDrawing) {
      window.addDrawingBlock = addDrawingBlock;
    }
  }, [onAddDrawing, focusedBlockId, contentBlocks]);

  const currentDrawingData = currentDrawingId
    ? contentBlocks.find(block => block.id === currentDrawingId)?.data
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

      <div className="content-blocks">
        {contentBlocks.map((block, index) => (
          <div key={block.id} className="content-block">
            {block.type === 'text' ? (
              <textarea
                ref={el => textareaRefs.current[block.id] = el}
                className="content-editor"
                placeholder={index === 0 ? "Start writing..." : ""}
                value={block.content}
                onChange={(e) => handleTextChange(block.id, e.target.value)}
                onFocus={() => handleTextFocus(block.id)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                rows={Math.max(1, block.content.split('\n').length)}
                style={{ minHeight: '24px' }}
              />
            ) : block.type === 'drawing' ? (
              <DrawingCanvas
                id={block.id}
                canvasData={block.data}
                onClick={openDrawingEditor}
                isHighlighted={highlightedDrawingId === block.id}
              />
            ) : null}
          </div>
        ))}
      </div>

      <DrawingPopup
        isOpen={showDrawingPopup}
        onClose={closeDrawingPopup}
        onSave={saveDrawing}
        onDelete={deleteCurrentDrawingBlock}
        initialData={currentDrawingData}
      />

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>Delete Drawing Block?</h3>
            <p>Are you sure you want to delete this drawing block? This action cannot be undone.</p>
            <div className="delete-popup-buttons">
              <button className="cancel-btn" onClick={cancelDeleteDrawing}>
                Cancel
              </button>
              <button className="delete-btn" onClick={deleteDrawingBlock}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;