import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import * as sounds from './sounds.js';
import { socket } from './socket.js';


export function move_player_locally(screen) {
    let dx = 0, dy = 0;
    if (input.keys["KeyA"]) dx -= 1;
    if (input.keys["KeyD"]) dx += 1;
    if (input.keys["KeyW"]) dy -= 1;
    if (input.keys["KeyS"]) dy += 1;

    sounds.playFootstepsSound(dx, dy);
    
    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx = (dx / len) * session.player.speed;
        dy = (dy / len) * session.player.speed;
    }

    session.player.world_x = Math.max(0, Math.min(constants.world_width, session.player.world_x + dx));
    session.player.world_y = Math.max(0, Math.min(constants.world_height, session.player.world_y + dy));

    const worldMouseX = input.mouseX + screen.camera_x;
    const worldMouseY = input.mouseY + screen.camera_y;

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

export function draw_player(screen) {
    const offsetX = session.player.world_x - screen.camera_x;
    const offsetY = session.player.world_y - screen.camera_y;

    constants.ctx.save();
    constants.ctx.translate(offsetX, offsetY);
    constants.ctx.rotate(session.player.angle);
    equipment.draw_players_vest(session.player.socket_Id);
    equipment.draw_players_backpack(session.player.socket_Id);
    constants.ctx.drawImage(
        images.playerImg,
        -session.player.width / 2,
        -session.player.height / 2,
        session.player.width,
        session.player.height
    );
    equipment.draw_players_helmet(session.player.socket_Id);
    constants.ctx.restore();
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function draw_opponent_players(screen) {
    const now = Date.now();

    for (const [id, opponent] of Object.entries(session.opponent_players)) {
        const { prev, target, timestamp } = opponent;

        const elapsed = now - timestamp;
        const interp = Math.min(elapsed / 50, 1);

        const world_x = lerp(prev.world_x, target.world_x, interp);
        const world_y = lerp(prev.world_y, target.world_y, interp);

        const prevAngle = prev.angle;
        const targetAngle = target.angle;
        let angleDiff = targetAngle - prevAngle;
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        const angle = prevAngle + angleDiff * interp;

        const screen_x = world_x - screen.camera_x;
        const screen_y = world_y - screen.camera_y;

        constants.ctx.save();
        constants.ctx.translate(screen_x, screen_y);
        constants.ctx.rotate(angle);
        equipment.draw_players_vest(id);
        equipment.draw_players_backpack(id);
        constants.ctx.drawImage(
            images.playerImg,
            -session.player.width / 2,
            -session.player.height / 2,
            session.player.width,
            session.player.height
        );
        equipment.draw_players_helmet(id);
        constants.ctx.restore();
    }
}

  
