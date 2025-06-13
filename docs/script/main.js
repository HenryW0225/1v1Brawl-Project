import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';
import * as session from './session.js';
import * as weapons from './weapons.js';
import { socket } from './socket.js';

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
});

socket.on('room-created', ({ roomCode, players }) => {
    session.player.socket_Id = socket.id;
    session.update_room_code(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-joined', ({ roomCode, players }) => {
    session.player.socket_Id = socket.id;
    document.getElementById("enterCodePage").style.display = "none";
    session.update_room_code(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-error', (msg) => {
    alert(msg);
});

socket.on('player-list-updated', (players) => {
    startUI.updatePlayers(players);
});

socket.on('game-started', () => {
    socket.emit('add-player-info', { roomCode: session.roomCode, player: session.player });
    document.getElementById("loadingPage").style.display = "none";
    if (images.originalworldmapImg.complete) {
        document.getElementById("gameContainer").style.display = "flex";
        layout.create_worldmap();
        requestAnimationFrame(gameLoop.game_loop);
    } else {
        images.originalworldmapImg.onload = () => {
            document.getElementById("gameContainer").style.display = "flex";
            layout.create_worldmap();
            requestAnimationFrame(gameLoop.game_loop);
        };
    }
});

socket.on('state-update', ({ players }) => {
    session.update_players(socket.id, players);
});

socket.on("remove-player", (id) => {
    delete session.opponent_players[id];
});

socket.on('bullet-fired', (bullet) => {
    weapons.add_bullet(bullet);
});
