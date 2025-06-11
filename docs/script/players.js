import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import { socket } from './socket.js';

export function move_player() {
    socket.emit('player-input', {
        roomCode: session.roomCode,
        inputs: {
            up: input.keys["KeyW"],
            down: input.keys["KeyS"],
            left: input.keys["KeyA"],
            right: input.keys["KeyD"],
            mouseX: input.mouseX,
            mouseY: input.mouseY
        }
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
