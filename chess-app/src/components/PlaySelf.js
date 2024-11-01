import React, { useState } from 'react';
import ChessGame from './Chessboard.js';
import { Chess } from 'chess.js';
// import { Chessboard } from 'react-chessboard';
// import { handlePieceDrop, updateGameStatus } from '../utils/chessUtils';

const PlaySelf = () => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState('Game in progress.');
  const [errorMessage, setErrorMessage] = useState('');

  // const onPieceDrop = (sourceSquare, targetSquare) => {
  //   return handlePieceDrop(game, sourceSquare, targetSquare, setGame, setErrorMessage, (newGame) => updateGameStatus(newGame, setGameStatus));
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Chessboard with Initial Positions</h1>
      <ChessGame />
      <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
      <div style={{ marginTop: '10px' }}>{gameStatus}</div>
    </div>
  );
};

export default PlaySelf;
