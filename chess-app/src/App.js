// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chessboard from './components/Chessboard';
import PredictionBar from './components/PredictionBar';
import './output.css';
import HomePage from './components/HomePage';
import PlaySelf from './components/PlaySelf';
import PlayOnline from './components/PlayOnline';
import PlayComputer from './components/PlayComputer';
import AnalysePosition from './components/AnalysePosition';

function App() {
  return (
    <div className="h-screen flex bg-gray-900 text-gray-200">
      <Router>
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play-self" element={<PlaySelf />} />
            <Route path="/play-online" element={<PlayOnline />} />
            <Route path="/play-computer" element={<PlayComputer />} />
            <Route path="/solve-puzzles" element={<Chessboard />} />
            <Route path="/analyse-position" element={<AnalysePosition />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
