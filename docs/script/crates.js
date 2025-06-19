import * as images from './images.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import * as sounds from './sounds.js';
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
            hp: 25,
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

export function draw_crates(screen) {
    for (const id in game_crates) {
        const crate = game_crates[id];

        const screenX = crate.x - crate.width / 2 - screen.camera_x;
        const screenY = crate.y - crate.height / 2 - screen.camera_y;

        if (
            screenX + crate.width < 0 ||
            screenX > constants.ctx_width ||
            screenY + crate.height < 0 ||
            screenY > constants.ctx_height
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
        if (distance < crate.width/2 + 2.5 && !bullet.hit) {
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

                socket.emit('proximity-sound-request', { 
                    roomCode: session.roomCode,
                    audio: "cratebreaking",
                    world_x: session.player.world_x,
                    world_y: session.player.world_y,
                    distance: sounds.proximity_range
                });
                return;
            }
            socket.emit('crate-hit', {
                roomCode: session.roomCode,
                damage: damage,
                crateId: id,
                bulletId: bullet.bulletId
            });

            socket.emit('proximity-sound-request', { 
                roomCode: session.roomCode,
                audio: "bullethit",
                world_x: session.player.world_x,
                world_y: session.player.world_y,
                distance: sounds.proximity_range
            });
        }
    }
}

export function update_crate_hp(crateId, damage) {
    game_crates[crateId].hp += damage;
    game_crates[crateId].width += damage*0.75;
    game_crates[crateId].height += damage*0.75;
}

export function destroy_crate(crateId) {
    delete game_crates[crateId];
}

export function reset_crates() {
    for (const key in game_crates) delete game_crates[key]; 
}
