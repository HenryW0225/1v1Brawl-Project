import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';
import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

const socket = io('https://onev1brawl-project.onrender.com');

startUI.createBtn.addEventListener("click", () => {
    startUI.create_button();
});

startUI.joinBtn.addEventListener("click", () => {
    startUI.join_button();
});

startUI.enterBtn.addEventListener("click", () => {
    startUI.enter_button();
});

startUI.startBtn.addEventListener("click", () => {
    startUI.start_button();
    gameLoop.reset_game();
    if (images.originalworldmapImg.complete) {
        layout.create_worldmap();
        gameLoop.game_loop();
    } else {
        images.originalworldmapImg.onload = () => {
            layout.create_worldmap();
            gameLoop.game_loop();
        };
    }
});

socket.on('room-created', ({ roomCode, players }) => {
    startUI.updateRoomCode(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-joined', ({ roomCode, players }) => {
    startUI.updateRoomCode(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-error', (msg) => {
    alert(msg);
});

socket.on('player-list-updated', (players) => {
    startUI.updatePlayers(players);
});
