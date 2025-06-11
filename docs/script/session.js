export let roomCode = null;

export function update_room_code(code) {
    roomCode = code;
    document.getElementById("roomCode").textContent = roomCode;
}

export let player = {
    world_x: 250,
    world_y: canvas.height,
    position_x: 0,
    position_y: 0,
    angle: 0,
    width: 50,
    height: 50,
    health: 100,
    speed: 5,
    weapon: 1
}

export let opponent_players = {};

export function update_players(socket_Id, players) {
    opponent_players = {};
  
    for (const [id, p] of Object.entries(players)) {
      if (id === socket_Id) {
        player.world_x = p.world_x;
        player.world_y = p.world_y;
        player.angle = p.angle ?? player.angle;
      } else {
        opponent_players[id] = {
          world_x: p.world_x,
          world_y: p.world_y,
          angle: p.angle ?? 0,
        };
      }
    }
  }
  