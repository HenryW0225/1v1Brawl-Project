import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { rooms, createRoom, joinRoom, leaveRoom, getRoom } from './rooms.js';
import { startGame, movePlayer, addPlayerInfo, gameStates, player_hit, update_health} from './games.js';

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
        io.to(roomCode).emit('update-player-equipment', socket.id, {helmet: 0, vest: 0, backpack: 0});
    });

    socket.on('fire-bullet', ({ roomCode, world_x, world_y, angle, type, distance }) => {
        const id = crypto.randomUUID();
        const bullet = {
            world_x: world_x,
            world_y: world_y,
            angle: angle,
            type: type,
            distance: distance,
            bulletId: id,
            shooterId: socket.id,
            hit: false
        };
        io.to(roomCode).emit('bullet-fired', bullet);
    });
    

    socket.on('player-hit', ({ roomCode, damage, bulletId }) => {
        update_health(roomCode, socket.id, damage, io);
        player_hit(roomCode, socket.id, bulletId, io);
    });

    socket.on('used-bandage', ({ roomCode, damage }) => {
        update_health(roomCode, socket.id, damage, io);
    });

    socket.on('create-crates', ({ roomCode, new_crates }) => {
        io.to(roomCode).emit('crates-created', new_crates);
    });

    socket.on('crate-hit', ({ roomCode, damage, crateId }) => {
        io.to(roomCode).emit('crate-update-hp', {damage, crateId});
    });

    socket.on('crate-destroyed', ({ roomCode, crateId, playerId, new_equipment }) => {
        io.to(roomCode).emit('remove-crate', {crateId, playerId, new_equipment});
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
