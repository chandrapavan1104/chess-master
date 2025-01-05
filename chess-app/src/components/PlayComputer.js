import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import axios from 'axios';
import { Chess } from 'chess.js';
import '../App.css';

const PlayComputer = () => {
  const [position, setPosition] = useState('start');
  const [difficulty, setDifficulty] = useState('easy');
  const [chess, setChess] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState('Select the difficulty level and start a New Game');
  const [history, setHistory] = useState([{ position: 'start', move: '', evaluation: 0 }]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [movesAllowed, setMovesAllowed] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [bestMove, setBestMove] = useState('');
  const [displayBestMove, setDisplayBestMove] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setChess(new Chess());
    setHistory([{ position: 'start', move: '', evaluation: 0 }]);
    setCurrentMoveIndex(0);
  }, []);

  useEffect(() => {
    // Whenever history updates, move to the last entry
    setCurrentMoveIndex(history.length);
  }, [history]);

  const updateGameStatus = (chessInstance, setGameStatus) => {
    if (chessInstance.isCheckmate()) {
      setGameStatus(`Checkmate! ${chessInstance.turn() === 'w' ? 'Black' : 'White'} wins.`);
      setMovesAllowed(false);
    } else if (chessInstance.isStalemate()) {
      setGameStatus("Stalemate! It's a draw.");
      setMovesAllowed(false);
    } else if (chessInstance.isInsufficientMaterial()) {
      setGameStatus('Draw! Insufficient material.');
      setMovesAllowed(false);
    } else if (chessInstance.isThreefoldRepetition()) {
      setGameStatus('Draw! Threefold repetition.');
      setMovesAllowed(false);
    } else if (chessInstance.isDraw()) {
      setGameStatus('Draw! Fifty-move rule.');
      setMovesAllowed(false);
    }
    // else {
    //   setGameStatus('Game in progress.'); 
    // }
  };

  const startNewGame = async (color, difficultyLevel) => {
    try {
      const response = await axios.post('http://localhost:8080/new_game', {
        color,
        difficulty: difficultyLevel
      });
      const newChess = new Chess(response.data.board_fen);

      setPosition(response.data.board_fen);
      setChess(newChess);
      setCurrentMoveIndex(0);
      setGameStatus('You are White! Make a move now');
      setDifficulty(difficultyLevel);
      setMovesAllowed(true); 
      setIsGameActive(true);
      setHistory([]); 
      setErrorMessage('');
    } catch (error) {
      console.log('Error starting new game:', error);
    }
  };

  const endGame = () => {
    setPosition('start');
    setChess(new Chess());
    setGameStatus('Select the difficulty level and start a New Game');
    setHistory([]);
    setErrorMessage('');
    setDisplayBestMove('');
    setIsGameActive(false);
  };

  const makeMove = async (fen, move, difficultyLevel) => {
    try {
      const response = await axios.post('http://localhost:8080/make_move', {
        fen,
        move,
        difficulty: difficultyLevel
      });

      chess.move(response.data.stockfish_move); 
      setBestMove(response.data.best_move);

      const newPosition = chess.fen();
      setPosition(newPosition);
      setGameStatus('Game in Progress...');

      setHistory((prevHistory) => [
        ...prevHistory,
        { 
          position: newPosition, 
          move: response.data.stockfish_move, 
          evaluation: response.data.evaluation 
        }
      ]);

      setCurrentMoveIndex(history.length);
      updateGameStatus(chess, setGameStatus);
      setMovesAllowed(true); 
    } catch (error) {
      console.log('Error making move:', error);
      setErrorMessage('Error making move. Please try again.');
    }
  };

  const onDrop = async (sourceSquare, targetSquare) => {
    if (!movesAllowed) return false;

    let moveString = `${sourceSquare}${targetSquare}`;
    const oldPosition = position;
    const piece = chess.get(sourceSquare);

    // Only allow White to move
    if (piece && piece.color !== 'w') {
      setErrorMessage('You can only move white pieces.');
      return false;
    }

    try {
      const promotionPiece = 'q'; 
      if (
        piece?.type === 'p' &&
        ((sourceSquare[1] === '7' && targetSquare[1] === '8') ||
         (sourceSquare[1] === '2' && targetSquare[1] === '1'))
      ) {
        moveString += promotionPiece; 
      }

      const moveResult = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionPiece
      });

      if (moveResult === null) {
        throw new Error('Illegal move');
      }

      const newPosition = chess.fen();
      setPosition(newPosition);

      setHistory((prevHistory) => [
        ...prevHistory,
        { position: newPosition, move: moveString, evaluation: null }
      ]);
      setCurrentMoveIndex(history.length);
      setDisplayBestMove('');

      await makeMove(oldPosition, moveString, difficulty);
      updateGameStatus(chess, setGameStatus);
      setErrorMessage('');
    } catch {
      setErrorMessage('Illegal move. Please try again.');
      return false;
    }
  };

  const goToMove = (index) => {
    if (index < 0) {
      // If going before the first move, reset to the starting position
      setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      chess.load(position);
    } else {
      const historyItem = history[index];
      setPosition(historyItem.position);
      chess.load(historyItem.position);
    }
    setCurrentMoveIndex(index);
    updateGameStatus(chess, setGameStatus);
    setMovesAllowed(index === history.length - 1); 
  };

  const HandledisplayBestMove = () => {
    setDisplayBestMove(bestMove);
  };

  const renderMoveList = () =>
    history.map((item, index) => (
      <li key={index} onClick={() => goToMove(index)}>
        {index + 1}. {item.move}
      </li>
    ));

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 p-4">
      {/* Container using a custom grid for md+ screens: [1fr 300px] */}
      <div className="w-full max-w-7xl md:grid md:grid-cols-[1fr_300px] gap-6">
        
        {/* Left Column: Chessboard & main content */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="mb-4 text-center text-lg">{gameStatus}</div>
          <Chessboard
            position={position}
            onPieceDrop={onDrop}
            boardWidth={650}
            className="rounded"
          />

          {/* Navigation for Moves */}
          <div className="mt-4 flex justify-between w-full space-x-2">
            <button
              onClick={() => goToMove(currentMoveIndex - 1)}
              disabled={currentMoveIndex < 0 || history.length === 0 || !isGameActive}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded disabled:opacity-50"
            >
              &lt; Previous
            </button>
            <button
              onClick={() => goToMove(history.length - 1)}
              disabled={currentMoveIndex >= history.length - 1 || !isGameActive}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded disabled:opacity-50"
            >
              Current
            </button>
            <button
              onClick={() => goToMove(currentMoveIndex + 1)}
              disabled={currentMoveIndex >= history.length - 1 || !isGameActive}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        </div>

        {/* Right Column: Controls and Game History (fixed 300px on md+) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          {/* Start and End Game Buttons */}
          <div className="space-y-4">
            {!isGameActive ? (
              <>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-gray-200"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button
                  onClick={() => startNewGame('white', difficulty)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                  Start New Game
                </button>
              </>
            ) : (
              <button
                onClick={endGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
              >
                End Game
              </button>
            )}
          </div>

          {isGameActive && (
            <div className="mt-6 flex flex-col space-y-4">
              <h2 className="text-center font-semibold">Game History</h2>
              <ul className="overflow-y-auto max-h-80 text-gray-300 text-sm space-y-1">
                {renderMoveList()}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 text-red-400">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PlayComputer;