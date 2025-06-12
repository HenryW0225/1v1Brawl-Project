export const gameStates = {};
const TICK_RATE = 100; 

export function startGame(roomCode) {
    gameStates[roomCode] = {
        players: {},
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
        speed: player.speed,
        width: player.width,
        height: player.height
    };

    state.readyCount++;

    if (state.readyCount >= 2 && !state.updateStarted) {
        state.updateStarted = true;
        startUpdating(roomCode, io);
        console.log(`Started update loop for room ${roomCode}`);
    }
}


export function movePlayer(socket_Id, roomCode, world_x, world_y, angle) {
    const room = gameStates[roomCode];
    if (!room || !room.players[socket_Id]) return;

    const player = room.players[socket_Id];

    player.world_x = world_x;
    player.world_y = world_y;
    player.angle = angle;
}

export function player_hit(roomCode, socket_Id, damage) {
    gameStates[roomCode].player[socket_Id].health -= damage;
    if (gameStates[roomCode].player[socket_Id].health < 0) {
        gameStates[roomCode].player[socket_Id].health = 0;
    }
}

export function endGame() {

}