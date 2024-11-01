// src/components/PredictionBar.js
import React from 'react';

const PredictionBar = ({ evaluation, height, width }) => {
  const whitePercentage = (evaluation * 100).toFixed(0);
  const blackPercentage = (100 - evaluation * 100).toFixed(0);

  return (
    <div
      className="flex flex-col-reverse"
      style={{
        height: height, // Matches chessboard height
        width: width, // Proportional width based on chessboard size
        border: '2px solid gray',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: `${whitePercentage}%`,
          backgroundColor: 'white',
          color: 'black',
          fontSize: '0.8em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {whitePercentage}%
      </div>
      <div
        style={{
          height: `${blackPercentage}%`,
          backgroundColor: 'black',
          color: 'white',
          fontSize: '0.8em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {blackPercentage}%
      </div>
    </div>
  );
};

export default PredictionBar;
