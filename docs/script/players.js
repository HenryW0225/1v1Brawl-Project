import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';

export function move_player() {
    let dx = 0;
    let dy = 0;
    if (input.keys["KeyA"]) dx -= 1;
    if (input.keys["KeyD"]) dx += 1;
    if (input.keys["KeyW"]) dy -= 1;
    if (input.keys["KeyS"]) dy += 1;

    const length = Math.hypot(dx, dy);
    if (length > 0) {
        dx = (dx / length) * constants.player.speed;
        dy = (dy / length) * constants.player.speed;
    }
    constants.player.world_x += dx;
    constants.player.world_y += dy;

    constants.player.world_x = Math.max(0, Math.min(constants.world_width, constants.player.world_x));
    constants.player.world_y = Math.max(0, Math.min(constants.world_height, constants.player.world_y));
}

export function draw_player() {
    const offsetX = constants.player.world_x - constants.position_x + constants.ctx_width / 2;
    const offsetY = constants.player.world_y - constants.position_y + constants.ctx_height / 2;

    const worldMouseX = input.mouseX + constants.position_x - constants.ctx_width / 2;
    const worldMouseY = input.mouseY + constants.position_y - constants.ctx_height / 2;

    const dx = worldMouseX - constants.player.world_x;
    const dy = worldMouseY - constants.player.world_y;
    constants.player.angle = Math.atan2(dy, dx) + Math.PI/2;

    constants.ctx.save();
    constants.ctx.translate(offsetX, offsetY);
    constants.ctx.rotate(constants.player.angle);
    constants.ctx.drawImage(images.playerImg, -constants.player.width / 2, -constants.player.height / 2, constants.player.width, constants.player.height);
    constants.ctx.restore();
}
