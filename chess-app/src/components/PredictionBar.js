// src/components/PredictionBar.js
import React from 'react';

const PredictionBar = ({ evaluation }) => {
  const whitePercentage = (evaluation * 100).toFixed(0);
  const blackPercentage = (100 - evaluation * 100).toFixed(0);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, height: `${whitePercentage}%`, backgroundColor: 'white' }}>{whitePercentage}%</div>
      <div style={{ ...styles.bar, height: `${blackPercentage}%`, backgroundColor: 'black', color: 'white', textAlign: 'right' }}>{blackPercentage}%</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    width: '30px',
    //marginLeft: '20px',
    marginTop: '150px',
    border: '1px solid black'
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width: '100%'
  }
};

export default PredictionBar;
