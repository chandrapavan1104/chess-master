import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // Add this library
import Chessboard from './Chessboard';
import { Chess } from 'chess.js'; // Reuse your chess.js instance if already imported

const socket = io('http://localhost:3001'); // Backend WebSocket server

function PlayOnline() {
  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState('start');
  const [color, setColor] = useState(''); // Player's color
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState('Create or join a room to start playing!');
  const [roomInput, setRoomInput] = useState(''); // Room ID for joining

  useEffect(() => {
    // Handle socket events
    socket.on('roomCreated', (data) => {
      setRoomId(data.roomId);
      setColor(data.color);
      setFen(data.fen);
      setStatus(data.message);
      setChess(new Chess()); // Reset board
    });

    socket.on('roomError', (data) => {
      setStatus(data.message);
    });

    socket.on('roomJoined', (data) => {
      setRoomId(data.roomId);
      setFen(data.fen);
      setStatus(data.message);
      setChess(new Chess(data.fen));
    });

    socket.on('assignColor', (data) => {
      setColor(data.color);
    });

    socket.on('opponentMove', (data) => {
      setFen(data.fen);
      setChess(new Chess(data.fen));
      setStatus("It's your move!");
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomError');
      socket.off('roomJoined');
      socket.off('assignColor');
      socket.off('opponentMove');
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit('createRoom');
  };

  const handleJoinRoom = () => {
    if (!roomInput.trim()) {
      setStatus('Please enter a valid room ID.');
      return;
    }
    socket.emit('joinRoom', roomInput.trim());
  };

  const onPieceDrop = (sourceSquare, targetSquare) => {
    const newChess = new Chess(chess.fen());
    const move = newChess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (!move) return false; // Illegal move

    const newFen = newChess.fen();
    setChess(newChess);
    setFen(newFen);
    setStatus('Waiting for opponent...');

    socket.emit('makeMove', {
      roomId,
      fen: newFen,
      from: sourceSquare,
      to: targetSquare,
    });

    return true;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4">Play Online</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Create Room */}
        <button
          onClick={handleCreateRoom}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          Create Room
        </button>

        {/* Join Room */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Room ID"
            className="p-2 rounded bg-gray-700 text-gray-200"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <button
            onClick={handleJoinRoom}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Display Room and Status */}
      <p className="mb-2">
        <span className="font-semibold">Room ID:</span> {roomId || 'None'}
      </p>
      <p className="mb-6">
        <span className="font-semibold">Status:</span> {status}
      </p>

      {/* Show player color */}
      {color && (
        <p className="mb-4">
          <span className="font-semibold">You are playing as:</span> {color}
        </p>
      )}

      {/* Chessboard */}
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardWidth={600}
        orientation={color === 'black' ? 'black' : 'white'}
      />
    </div>
  );
}

export default PlayOnline;