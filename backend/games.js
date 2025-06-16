export const gameStates = {};
const TICK_RATE = 50; 

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
    };

    state.readyCount++;

    if (state.readyCount >= 4 && !state.updateStarted) {
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

export function player_hit(roomCode, socket_Id, bulletId, io) {
    const room = gameStates[roomCode];
    if (!room) return;

    io.to(roomCode).emit('remove-bullet', (bulletId));

    if (room.players[socket_Id].health === 0) {
        delete room.players[socket_Id];
        io.to(roomCode).emit('player-death', (socket_Id));
        if (Object.keys(room.players).length < 2) {
            room.gameOver = true;
            io.to(roomCode).emit('game-over');
            delete gameStates[roomCode]; 
        }
    }
}

export function update_health(roomCode, socket_Id, damage, protection, io) {
    const room = gameStates[roomCode];
    if (!room) return;

    room.players[socket_Id].health += (1 - Math.min(100, protection)/100) * damage;
    room.players[socket_Id].health = Math.max(Math.min(100, room.players[socket_Id].health), 0);
    io.to(socket_Id).emit('update-health', { newHealth: room.players[socket_Id].health });
}

