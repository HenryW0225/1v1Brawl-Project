import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';
import * as session from './session.js';
import * as weapons from './weapons.js';
import * as input from './input.js';
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
    gameLoop.start_game_loop();
    document.getElementById('healthBar').style.width = 100 + '%';
    document.getElementById('healthBarText').textContent = 100 + ' / 100';

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

socket.on('update-health', ({ newHealth} ) => {
    document.getElementById('healthBar').style.width = newHealth + '%';
    document.getElementById('healthBarText').textContent = newHealth + ' / 100';
});

socket.on('game-over', () => {
    gameLoop.stop_game_loop();

    setTimeout(() => {
        document.getElementById("gameContainer").style.display = "none";
        document.getElementById("loadingPage").style.display = "block";
        session.players_reset();
        weapons.weapons_reset();
        input.reset();
    }, 4000); 
});

socket.on('remove-bullet', (bulletId) => {
    const index = weapons.bullets.findIndex(bullet => bullet.bulletId === bulletId);
    if (index !== -1) {
        weapons.bullets.splice(index, 1);
    }
});
