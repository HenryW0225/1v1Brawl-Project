import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { rooms, createRoom, joinRoom, leaveRoom, getRoom } from './rooms.js';
import { startGame, movePlayer, addPlayerInfo, endGame} from './games.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create-room', ({ username }) => {
        const roomCode = createRoom(socket.id, username);
        socket.join(roomCode);
        io.to(roomCode).emit('room-created', { roomCode, players: rooms[roomCode] });
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });
    
    socket.on('join-room', ({ roomCode, username }) => {
        const success = joinRoom(roomCode, socket.id, username);
        if (success) {
            socket.join(roomCode);
            io.to(roomCode).emit('room-joined', { roomCode, players: rooms[roomCode] });
            console.log(`${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit('room-error', 'Room full or does not exist');
        }
    });

    socket.on('start-game', ({ roomCode }) => {
        startGame(roomCode, io);
        io.to(roomCode).emit('game-started');
    });

    socket.on('player-input', ({ roomCode, inputs }) => {
        movePlayer(socket.id, roomCode, inputs);
    });

    socket.on('add-player-info', ({ roomCode, player }) => {
        addPlayerInfo(roomCode, player);
    });

    socket.on('disconnect', () => {
        const roomCode = leaveRoom(socket.id);
        if (roomCode) {
            io.to(roomCode).emit('opponent-left');
            console.log(`${socket.id} left room ${roomCode}`);
            io.to(roomCode).emit('player-list-updated', rooms[roomCode]?.map(p => ({ name: p.name })) || []);
        }
    });    
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
