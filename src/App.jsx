import React from 'react';
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

function App() {
  const handleAddDrawing = () => {
    // Call the addDrawingBlock function that's exposed by MainContent
    if (window.addDrawingBlock) {
      window.addDrawingBlock();
    }
  };

  return (
    <div className="container">
      <Header />
      <Toolbar onAddDrawing={handleAddDrawing} />
      <MainContent onAddDrawing={handleAddDrawing} />
      <Footer />
    </div>
  );
}

export default App;