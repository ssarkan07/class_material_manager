import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import FilesLink from './screens/FilesLink';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/files/:subject" element={<FilesLink />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
