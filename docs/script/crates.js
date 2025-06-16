import * as images from './images.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import { socket } from './socket.js';

let game_crates = {}; 

export function create_crates(min, max) {
    const crateCount = Math.floor(Math.random() * (max-min+1)) + min;
    const crateSize = 80;
    const halfSize = crateSize / 2;
    const maxAttempts = 1000;
    const created_crates = {};

    let attempts = 0;
    let i = 0;

    while (i < crateCount && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (constants.world_width - crateSize)) + halfSize;
        const y = Math.floor(Math.random() * (constants.world_height - crateSize)) + halfSize;

        const newCrate = {
            x, 
            y, 
            width: crateSize,
            height: crateSize,
            hp: 30,
            used: false
        };

        let overlaps = false;
        for (const id in created_crates) {
            const c = created_crates[id];
            if (
                x < c.x + crateSize &&
                x > c.x - crateSize &&
                y < c.y + crateSize &&
                y > c.y - crateSize
            ) {
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            for (const id in game_crates) {
                const c = game_crates[id];
                if (
                    x < c.x + crateSize &&
                    x > c.x - crateSize &&
                    y < c.y + crateSize &&
                    y > c.y - crateSize
                ) {
                    overlaps = true;
                    break;
                }
            }
        }

        if (!overlaps) {
            const crateId = crypto.randomUUID();
            created_crates[crateId] = newCrate;
            i++;
        }

        attempts++;
    }

    return created_crates;
}

export function add_crates(new_crates) {
    Object.assign(game_crates, new_crates); 
}

export function draw_crates() {
    const camera = {
        x: session.player.world_x - constants.ctx_width / 2,
        y: session.player.world_y - constants.ctx_height / 2,
        width: constants.ctx_width,
        height: constants.ctx_height
    };

    camera.x = Math.max(0, Math.min(camera.x, constants.world_width - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, constants.world_height - camera.height));

    for (const id in game_crates) {
        const crate = game_crates[id];

        const screenX = crate.x - crate.width / 2 - camera.x;
        const screenY = crate.y - crate.height / 2 - camera.y;

        if (
            screenX + crate.width < 0 ||
            screenX > camera.width ||
            screenY + crate.height < 0 ||
            screenY > camera.height
        ) {
            continue;
        }

        constants.ctx.drawImage(
            images.crateImg,
            screenX,
            screenY,
            crate.width,
            crate.height
        );
    }
}

export function bullet_check(bullet, damage) {
    for (const id in game_crates) {
        const crate = game_crates[id];
        const distance = Math.sqrt((crate.x - bullet.world_x) * (crate.x - bullet.world_x) + (crate.y - bullet.world_y) * (crate.y - bullet.world_y));
        if (distance < crate.width/2 + 5 && !bullet.hit) {
            bullet.hit = true;
            if (crate.hp + damage <= 0 && !crate.used) {
                crate.used = true;
                const new_equipment = equipment.equipment_upgrade(session.player.socket_Id);
                socket.emit('crate-destroyed', {
                    roomCode: session.roomCode,
                    crateId: id,
                    playerId: session.player.socket_Id,
                    bulletId: bullet.bulletId,
                    new_equipment: new_equipment
                });
                return;
            }
            socket.emit('crate-hit', {
                roomCode: session.roomCode,
                damage: damage,
                crateId: id,
                bulletId: bullet.bulletId
            });
        }
    }
}

export function update_crate_hp(crateId, damage) {
    game_crates[crateId].hp += damage;
    game_crates[crateId].width += damage * 1.5;
    game_crates[crateId].height += damage * 1.5;
}

export function destroy_crate(crateId) {
    delete game_crates[crateId];
}

export function reset_crates() {
    for (const key in game_crates) delete game_crates[key]; 
}
