import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { rooms, createRoom, joinRoom, leaveRoom, getRoom } from './rooms.js';
import { startGame, movePlayer, addPlayerInfo, gameStates, player_hit, endGame} from './games.js';

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
        startGame(roomCode);
        io.to(roomCode).emit('game-started');
    });

    socket.on('player-input', ({ roomCode, world_x, world_y, angle }) => {
        movePlayer(socket.id, roomCode, world_x, world_y, angle);
    });

    socket.on('add-player-info', ({ roomCode, player }) => {
        addPlayerInfo(roomCode, player, io);
    });

    socket.on('fire-bullet', ({ roomCode, world_x, world_y, angle, type, distance }) => {
        const bullet = {
            world_x: world_x,
            world_y: world_y,
            angle: angle,
            type: type,
            distance: distance,
            shooterId: socket.id
        };
        io.to(roomCode).emit('bullet-fired', bullet);
    });
    

    socket.on('player-hit', ({ roomCode, damage }) => {
        player_hit(roomCode, socket.id, damage);
    });

    socket.on('disconnect', () => {
        const roomCode = leaveRoom(socket.id);
        if (roomCode) {
            io.to(roomCode).emit('opponent-left');
            console.log(`${socket.id} left room ${roomCode}`);
            io.to(roomCode).emit('player-list-updated', rooms[roomCode]?.map(p => ({ name: p.name })) || []);
            
            if (gameStates[roomCode]?.players) {
                delete gameStates[roomCode].players[socket.id];
            }            
            io.to(roomCode).emit("remove-player", socket.id);
            if (Object.keys(gameStates[roomCode]?.players || {}).length === 0) {
                delete gameStates[roomCode];
            }            
        }
    });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
