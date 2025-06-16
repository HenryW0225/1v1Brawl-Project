export const gameStates = {};
const TICK_RATE = 50; 

const world_width = 2500;
const world_height = 1500;
const offset = 200;

function create_starting_positions() {
    const starting_positions = {
        1: {world_x: offset, world_y: offset, taken: false},
        2: {world_x: world_width-offset, world_y: world_height-offset, taken: false},
        3: {world_x: world_width-offset, world_y: offset, taken: false},
        4: {world_x: offset, world_y: world_height-offset, taken: false}
    }
    return starting_positions;
}

export function startGame(roomCode) {
    gameStates[roomCode] = {
        players: {},
        gameOver: false,
        readyCount: 0,
        updateStarted: false,
        starting_positions: create_starting_positions()
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

    gameStates[roomCode].updateInterval = gameInterval;
}

export function addPlayerInfo(roomCode, player, io) {
    const state = gameStates[roomCode];
    if (!state) return;
    
    let assignedPosition = null;

    for (const pos of Object.values(state.starting_positions)) {
        if (!pos.taken) {
            pos.taken = true;
            assignedPosition = pos;
            break;
        }
    }
    if (!assignedPosition) {
        assignedPosition = { world_x: world_width/2, world_y: world_height/2 }; 
    }
    state.players[player.socket_Id] = {
        world_x: assignedPosition.world_x,
        world_y: assignedPosition.world_y,
        angle: player.angle || 0,
        health: player.health,
        weapon: player.weapon,
    };

    io.to(player.socket_Id).emit('starting-position', {world_x: assignedPosition.world_x, world_y: assignedPosition.world_y});

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

export function player_hit(roomCode, socket_Id, bulletId, io) {
    const room = gameStates[roomCode];
    if (!room) return;

    io.to(roomCode).emit('remove-bullet', (bulletId));

    if (room.players[socket_Id].health === 0) {
        delete room.players[socket_Id];
        io.to(roomCode).emit("remove-player", socket_Id);
        io.to(socket_Id).emit("player-death");
        if (Object.keys(room.players).length < 2) {
            if (room.updateInterval) {
                clearInterval(room.updateInterval);
            }
            io.to(Object.keys(room.players)[0]).emit('victory');
            io.to(roomCode).emit('game-over');
            for (let key in room.starting_positions) {
                room.starting_positions[key].taken = false;
            }
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

