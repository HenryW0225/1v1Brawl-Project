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
    socket_Id: null
}

export let opponent_players = {};

export function update_players(socket_Id, players) {
    opponent_players = {};
  
    for (const [id, p] of Object.entries(players)) {
      if (id === socket_Id) {
        player.world_x = p.world_x;
        player.world_y = p.world_y;
        player.angle = p.angle;
      } else {
        opponent_players[id] = {
          world_x: p.world_x,
          world_y: p.world_y,
          angle: p.angle,
        };
      }
    }
  }
  