import * as constants from './constants.js';

const gameStates = {};
const TICK_RATE = 33; 

export function startGame(roomCode) {
    gameStates[roomCode] = {
        players: {},
        bullets: {},
        gameOver: false,
        readyCount: 0,
        updateStarted: false
    };
}

export function startUpdating(roomCode, io) {
    const gameInterval = setInterval(() => {
        const state = gameStates[roomCode];
        if (!state || state.gameOver) {
            clearInterval(gameInterval);
            return;
        }
        io.to(roomCode).emit('state-update', {
            players: state.players,
            bullets: state.bullets
        });
    }, TICK_RATE);
}

export function addPlayerInfo(roomCode, player, io) {
    const state = gameStates[roomCode];
    if (!state) return;

    state.players[player.socket_Id] = {
        world_x: player.world_x,
        world_y: player.world_y,
        angle: player.angle || 0,
        health: player.health,
        weapon: player.weapon,
        speed: player.speed
    };

    state.readyCount++;

    if (state.readyCount >= 2 && !state.updateStarted) {
        state.updateStarted = true;
        startUpdating(roomCode, io);
        console.log(`Started update loop for room ${roomCode}`);
    }
}


export function movePlayer(socket_Id, roomCode, inputs) {
    const room = gameStates[roomCode];
    if (!room || !room.players[socket_Id]) return;

    const player = room.players[socket_Id];

    let dx = 0, dy = 0;
    if (inputs.left) dx -= 1;
    if (inputs.right) dx += 1;
    if (inputs.up) dy -= 1;
    if (inputs.down) dy += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx = (dx / len) * player.speed;
        dy = (dy / len) * player.speed;
    }

    player.world_x = Math.max(0, Math.min(constants.worldWidth, player.world_x + dx));
    player.world_y = Math.max(0, Math.min(constants.worldHeight, player.world_y + dy));

    const worldMouseX = inputs.mouseX + player.world_x - constants.canvasWidth / 2;
    const worldMouseY = inputs.mouseY + player.world_y - constants.canvasHeight / 2;

    player.angle = Math.atan2(worldMouseY - player.world_y, worldMouseX - player.world_x) + Math.PI / 2;
}


export function endGame() {

}