import * as constants from './constants.js';

export let roomCode = null;

export function update_room_code(code) {
    roomCode = code;
    document.getElementById("roomCode").textContent = roomCode;
}

export let player = {
    world_x: 250,
    world_y: constants.ctx_height,
    angle: 0,
    health: 100,
    weapon: 1,
    speed: 5,
    width: 50,
    height: 50,
    socket_Id: null
}

export let opponent_players = {};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function update_players(socket_Id, players) {
  for (const [id, p] of Object.entries(players)) {
    if (id === socket_Id) {
      player.world_x = lerp(player.world_x, p.world_x, 0.1);
      player.world_y = lerp(player.world_y, p.world_y, 0.1);
      player.angle = p.angle;
    } else {
      if (!opponent_players[id]) {
        opponent_players[id] = {
          prev: { ...p },
          target: { ...p },
          timestamp: Date.now()
        };
      } else {
        opponent_players[id].prev = { ...opponent_players[id].target };
        opponent_players[id].target = { ...p };
        opponent_players[id].timestamp = Date.now();
      }
    }
  }
}

  
