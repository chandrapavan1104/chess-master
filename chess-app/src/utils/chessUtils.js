import { Chess } from 'chess.js';

const handlePieceDrop = (game, sourceSquare, targetSquare, setGame, setErrorMessage, updateGameStatus) => {
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

const updateGameStatus = (game, setGameStatus) => {
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

export { handlePieceDrop, updateGameStatus };
