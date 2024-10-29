import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import PredictionBar from './PredictionBar';
import { handlePieceDrop, updateGameStatus } from '../utils/chessUtils';

const AnalysePosition = () => {
  const [fen, setFen] = useState('');
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState('Game in progress.');
  const [errorMessage, setErrorMessage] = useState('');
  const [evaluation, setEvaluation] = useState(0.5);

  const onFenChange = (event) => {
    setFen(event.target.value);
  };

  const onFenSubmit = async () => {
    try {
      let fenToSubmit = fen;
      if (!fen.includes(' ')) {
        fenToSubmit = fen + ' w - - 0 1';
      }
      const newGame = new Chess(fenToSubmit);
      if (newGame.fen() === fenToSubmit) {
        setGame(newGame);
        setErrorMessage('');
        updateGameStatus(newGame, setGameStatus);
        fetchEvaluation(fenToSubmit);
      } else {
        setErrorMessage('Invalid FEN string');
      }
    } catch (error) {
      setErrorMessage('Invalid FEN string');
    }
  };

  const fetchEvaluation = async (fen) => {
    try {
      const response = await fetch('http://localhost:8080/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        console.log(data.score);
        console.log(data.mate_chances);
        setEvaluation(data.score);
      }
    } catch (error) {
      setErrorMessage('Error fetching evaluation');
    }
  };

  const onPieceDrop = (sourceSquare, targetSquare) => {
    return handlePieceDrop(
      game,
      sourceSquare,
      targetSquare,
      setGame,
      setErrorMessage,
      (newGame) => {
        updateGameStatus(newGame, setGameStatus);
        fetchEvaluation(newGame.fen());
      }
    );
  };

  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-5/6 flex flex-col justify-center items-center">
        <h1>Analyse Position</h1>
        <input
          type="text"
          value={fen}
          onChange={onFenChange}
          placeholder="Enter FEN"
          style={{ marginBottom: '10px', padding: '5px', width: '400px' }}
        />
        <button onClick={onFenSubmit} style={{ marginBottom: '20px', padding: '5px 10px' }}>Set Position</button>    
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={600} // Adjust the width as desired
          />
        <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
        <div style={{ marginTop: '10px' }}>{gameStatus}</div>
      </div>
      <div className="w-1/6 flex flex-col justify-center items-center" >
          <PredictionBar evaluation={evaluation} />

      </div>
    </div>
      

    
  );
};

export default AnalysePosition;
