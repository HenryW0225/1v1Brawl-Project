const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); 

const rooms = {}; 

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", ({ name }) => {
        const roomCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        socket.join(roomCode);
        socket.roomCode = roomCode;

        rooms[roomCode] = rooms[roomCode] || { players: {} };
        rooms[roomCode].players[socket.id] = { name, x: 0, y: 0, angle: 0, weapon: 1 };

        io.to(roomCode).emit("roomData", rooms[roomCode].players);
        socket.emit("roomCreated", roomCode);
    });

    socket.on("joinRoom", ({ name, roomCode }) => {
        if (!rooms[roomCode]) {
            socket.emit("errorMessage", "Room code not found.");
            return;
        }
        socket.join(roomCode);
        socket.roomCode = roomCode;

        rooms[roomCode].players[socket.id] = { name, x: 0, y: 0, angle: 0, weapon: 1 };

        io.to(roomCode).emit("roomData", rooms[roomCode].players);
    });

    socket.on("move", (data) => {
        const roomCode = socket.roomCode;
        if (rooms[roomCode] && rooms[roomCode].players[socket.id]) {
            Object.assign(rooms[roomCode].players[socket.id], data);
            io.to(roomCode).emit("roomData", rooms[roomCode].players);
        }
    });

    socket.on("shoot", (data) => {
        const roomCode = socket.roomCode;
        if (roomCode) {
            socket.to(roomCode).emit("playerShot", { id: socket.id, ...data });
        }
    });

    socket.on("disconnect", () => {
        const roomCode = socket.roomCode;
        if (rooms[roomCode]) {
            delete rooms[roomCode].players[socket.id];
            io.to(roomCode).emit("roomData", rooms[roomCode].players);
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
