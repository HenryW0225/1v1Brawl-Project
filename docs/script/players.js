import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import { socket } from './socket.js';

export function move_player_locally() {
    let dx = 0, dy = 0;
    if (input.keys["KeyA"]) dx -= 1;
    if (input.keys["KeyD"]) dx += 1;
    if (input.keys["KeyW"]) dy -= 1;
    if (input.keys["KeyS"]) dy += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx = (dx / len) * session.player.speed;
        dy = (dy / len) * session.player.speed;
    }

    session.player.world_x = Math.max(0, Math.min(constants.world_width, session.player.world_x + dx));
    session.player.world_y = Math.max(0, Math.min(constants.world_height, session.player.world_y + dy));

    const camX = Math.max(0, Math.min(session.player.world_x - constants.ctx_width / 2, constants.world_width - constants.ctx_width));
    const camY = Math.max(0, Math.min(session.player.world_y - constants.ctx_height / 2, constants.world_height - constants.ctx_height));

    const worldMouseX = input.mouseX + camX;
    const worldMouseY = input.mouseY + camY;

    session.player.angle = Math.atan2(
        worldMouseY - session.player.world_y,
        worldMouseX - session.player.world_x
    ) + Math.PI / 2;
}

export function update_player_server() {
    socket.emit('player-input', {
        roomCode: session.roomCode,
        world_x: session.player.world_x,
        world_y: session.player.world_y,
        angle: session.player.angle
    }); 
}

export function draw_player() {
    const position_x = Math.max(Math.min(session.player.world_x, constants.world_width - constants.ctx_width / 2), constants.ctx_width / 2);
    const position_y = Math.max(Math.min(session.player.world_y, constants.world_height - constants.ctx_height / 2), constants.ctx_height / 2);

    const offsetX = session.player.world_x - position_x + constants.ctx_width / 2;
    const offsetY = session.player.world_y - position_y + constants.ctx_height / 2;

    constants.ctx.save();
    constants.ctx.translate(offsetX, offsetY);
    constants.ctx.rotate(session.player.angle);
    constants.ctx.drawImage(images.playerImg, -session.player.width / 2, -session.player.height / 2, session.player.width, session.player.height);
    constants.ctx.restore();
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function draw_opponent_players() {
    const position_x = Math.max(Math.min(session.player.world_x, constants.world_width - constants.ctx_width / 2), constants.ctx_width / 2);
    const position_y = Math.max(Math.min(session.player.world_y, constants.world_height - constants.ctx_height / 2), constants.ctx_height / 2);
  
    const now = Date.now();
  
    for (const [id, opponent] of Object.entries(session.opponent_players)) {
      const { prev, target, timestamp } = opponent;
  
      const elapsed = now - timestamp;
      const interp = Math.min(elapsed / 100, 1); 
  
      const world_x = lerp(prev.world_x, target.world_x, interp);
      const world_y = lerp(prev.world_y, target.world_y, interp);
  
      const prevAngle = prev.angle;
      const targetAngle = target.angle;
      let angleDiff = targetAngle - prevAngle;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      const angle = prevAngle + angleDiff * interp;
  
      const screen_x = world_x - position_x + constants.ctx_width / 2;
      const screen_y = world_y - position_y + constants.ctx_height / 2;
  
      constants.ctx.save();
      constants.ctx.translate(screen_x, screen_y);
      constants.ctx.rotate(angle);
      constants.ctx.drawImage(images.playerImg, -session.player.width / 2, -session.player.height / 2, session.player.width, session.player.height);
      constants.ctx.restore();
    }
  }
  
