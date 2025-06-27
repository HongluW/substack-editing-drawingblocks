import React, { useState } from 'react';
import './MainContent.css';

const MainContent = () => {
  const [authors, setAuthors] = useState(['Honglu Wang']);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  const removeAuthor = (name) => {
    setAuthors(authors.filter(a => a !== name));
  };

  const addAuthor = () => {
    const name = prompt('Enter author name:');
    if (name && !authors.includes(name)) setAuthors([...authors, name]);
  };

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
    </main>
  );
};

export default MainContent;