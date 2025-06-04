const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); 

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("updatePlayer", (data) => {
        socket.broadcast.emit("playerUpdate", data); // send to others
    });

    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        socket.broadcast.emit("playerLeft", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
