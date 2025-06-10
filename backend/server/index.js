import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createRoom, joinRoom, leaveRoom, getRoom } from './rooms.js';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create-room', () => {
        const roomCode = createRoom(socket.id);
        socket.join(roomCode);
        socket.emit('room-created', roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    socket.on('join-room', (roomCode) => {
        const success = joinRoom(roomCode, socket.id);
        if (success) {
            socket.join(roomCode);
            socket.emit('room-joined', roomCode);
            io.to(roomCode).emit('start-game');
            console.log(`${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit('room-error', 'Room full or does not exist');
        }
    });

    socket.on('player-action', (data) => {
        const room = getRoom(socket.id);
        if (room) {
            socket.to(room).emit('opponent-action', data);
        }
    });

    socket.on('disconnect', () => {
        const room = leaveRoom(socket.id);
        if (room) {
            io.to(room).emit('opponent-left');
            console.log(`${socket.id} left room ${room}`);
        }
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
