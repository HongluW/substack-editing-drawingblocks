import React from 'react';
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <Toolbar />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;