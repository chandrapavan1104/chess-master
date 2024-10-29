import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PlaySelf from './components/PlaySelf';
import PlayOnline from './components/PlayOnline';
import PlayComputer from './components/PlayComputer';
import SolvePuzzles from './components/SolvePuzzles';
import AnalysePosition from './components/AnalysePosition';

const App = () => {
  return (
    <Router>
        <div className='flex'>
          <Navbar />
          <div className="flex-grow text-lg font-bold flex justify-center items-center">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play-self" element={<PlaySelf />} />
            <Route path="/play-online" element={<PlayOnline />} />
            <Route path="/play-computer" element={<PlayComputer />} />
            <Route path="/solve-puzzles" element={<SolvePuzzles />} />
            <Route path="/analyse-position" element={<AnalysePosition />} />
          </Routes>
          </div>
        </div>
    </Router>
  );
};

export default App;
