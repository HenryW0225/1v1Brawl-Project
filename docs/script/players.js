import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import { socket } from './socket.js';

export function move_player_locally() {
    let dx = 0, dy = 0;
    if (inputs.left) dx -= 1;
    if (inputs.right) dx += 1;
    if (inputs.up) dy -= 1;
    if (inputs.down) dy += 1;
    
    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx = (dx / len) * session.player.speed;
        dy = (dy / len) * session.player.speed;
    }
    
    session.player.world_x = Math.max(0, Math.min(constants.ctx_width, session.player.world_x + dx));
    session.player.world_y = Math.max(0, Math.min(constants.ctx_height, session.player.world_y + dy));
    
    const worldMouseX = input.mouseX + session.player.world_x - constants.ctx_width / 2;
    const worldMouseY = input.mouseY + session.player.world_y - constants.ctx_height / 2;
    
    session.player.angle = Math.atan2(worldMouseY - session.player.world_y, worldMouseX - session.player.world_x) + Math.PI / 2;
}


export function update_player_server() {
    socket.emit('player-input', {
        roomCode: session.roomCode,
        world_x: session.player.world_x,
        world_y: session.player.world_y,
        angle: session.player.angle
    }); 
}

export function draw_players() {
    const position_x = Math.max(Math.min(session.player.world_x, constants.world_width - constants.ctx_width / 2), constants.ctx_width / 2);
    const position_y = Math.max(Math.min(session.player.world_y, constants.world_height - constants.ctx_height / 2), constants.ctx_height / 2);

    const offsetX = session.player.world_x - position_x + constants.ctx_width / 2;
    const offsetY = session.player.world_y - position_y + constants.ctx_height / 2;

    for (const opponent of Object.values(session.opponent_players)) {
        constants.ctx.save();
        const oppX = opponent.world_x - position_x + constants.ctx_width / 2;
        const oppY = opponent.world_y - position_y + constants.ctx_height / 2;

        constants.ctx.translate(oppX, oppY);
        constants.ctx.rotate(opponent.angle);
        constants.ctx.drawImage(images.playerImg, -session.player.width / 2, -session.player.height / 2, session.player.width, session.player.height);
        constants.ctx.restore();
    }

    constants.ctx.save();
    constants.ctx.translate(offsetX, offsetY);
    constants.ctx.rotate(session.player.angle);
    constants.ctx.drawImage(images.playerImg, -session.player.width / 2, -session.player.height / 2, session.player.width, session.player.height);
    constants.ctx.restore();
}
