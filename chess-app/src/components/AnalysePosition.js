import React, { useState, useEffect } from 'react';
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
  const [boardSize, setBoardSize] = useState(calculateBoardSize());

  // Function to calculate the board size based on window width and height
  function calculateBoardSize() {
    return Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, 650); // Adjusted max size
  }

  // Resize event listener to update board size
  useEffect(() => {
    const handleResize = () => {
      setBoardSize(calculateBoardSize());
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <div className="flex flex-col items-center bg-gray-900 text-gray-200 min-h-screen p-4">
      {/* FEN Input, Heading, and Button in a Single Row */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl mb-4 space-y-2 md:space-y-0 md:space-x-4">
        <h1 className="text-lg md:text-xl whitespace-nowrap">Analyse Position</h1>
        <input
          type="text"
          value={fen}
          onChange={onFenChange}
          placeholder="Enter FEN"
          className="flex-grow p-2 rounded bg-gray-800 text-gray-200"
        />
        <button
          onClick={onFenSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Set Position
        </button>
      </div>

      {/* Chessboard and Prediction Bar */}
      <div className="flex justify-center items-start space-x-4 w-full max-w-4xl">
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={boardSize} // Dynamic board size based on window resize
          />
          <div className="mt-4 text-center">{gameStatus}</div>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
        <PredictionBar evaluation={evaluation} height={boardSize} width={boardSize * 0.15} /> {/* Adjusted width */}
      </div>
    </div>
  );
};

export default AnalysePosition;
