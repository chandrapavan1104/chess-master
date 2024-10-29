import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState('Game in progress.');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    setErrorMessage(''); // Clear any previous error message

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Promote to a queen if applicable
      });

      if (move === null) {
        throw new Error('Illegal move');
      }

      const newGame = new Chess(game.fen());
      setGame(newGame);
      updateGameStatus(newGame);
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      return false;
    }
  };

  const updateGameStatus = (game) => {
    if (game.isCheckmate()) {
      setGameStatus('Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins.');
    } else if (game.isStalemate()) {
      setGameStatus('Stalemate! It\'s a draw.');
    } else if (game.isInsufficientMaterial()) {
      setGameStatus('Draw! Insufficient material.');
    } else if (game.isThreefoldRepetition()) {
      setGameStatus('Draw! Threefold repetition.');
    } else if (game.isDraw()) {
      setGameStatus('Draw! Fifty-move rule.');
    } else {
      setGameStatus('Game in progress.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Chessboard with Initial Positions</h1>
      <Chessboard position={game.fen()} onPieceDrop={handlePieceDrop} />
      <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
      <div style={{ marginTop: '10px' }}>{gameStatus}</div>
    </div>
  );
};

export default ChessGame;
