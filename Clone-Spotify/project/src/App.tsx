import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Spotify from './components/Spotify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Spotify />} />
      </Routes>
    </Router>
  );
}

export default App;