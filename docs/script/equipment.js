import * as constants from './constants.js';

export const helmetStats = {
    1: { color: '#2F74FF', protection: 5 },
    2: { color: '#F2F2F5', protection: 10 },
    3: { color: '#262626', protection: 15 },
    outer_color: '#000000',
    inner_radius: 13,
    outer_radius: 15,
    offset_y: 7
};

export const vestStats = {
    1: '#c0c0c0',
    2: '#505050',
    3: '#000000',
    outer_radius: 26.5
};

export const backpackStats = {
    0: { 1: 10, 2: 2 }, 
    1: { 1: 15, 2: 3, offset_y: 10 },
    2: { 1: 25, 2: 5, offset_y: 16 },
    3: { 1: 40, 2: 8, offset_y: 22 },
    color: '#816537',
    radius: 20
};

export let players_equipment = {
    // socketId: { helmet: 0, vest: 0, backpack: 0 }
};

export function draw_players_helmet(socket_Id) {
    const equipment = players_equipment[socket_Id];
    if (!equipment || equipment.helmet === 0) return;

    const helmetTier = equipment.helmet;

    constants.ctx.fillStyle = helmetStats.outer_color;
    constants.ctx.beginPath();
    constants.ctx.arc(0, helmetStats.offset_y, helmetStats.outer_radius, 0, 2 * Math.PI);
    constants.ctx.fill();

    constants.ctx.fillStyle = helmetStats[helmetTier].color;
    constants.ctx.beginPath();
    constants.ctx.arc(0, helmetStats.offset_y, helmetStats.inner_radius, 0, 2 * Math.PI);
    constants.ctx.fill();
}

export function draw_players_vest(socket_Id) {
    const equipment = players_equipment[socket_Id];
    if (!equipment || equipment.vest === 0) return;

    const vestTier = equipment.vest;
    constants.ctx.fillStyle = vestStats[vestTier];
    constants.ctx.beginPath();
    constants.ctx.arc(0, 1.5, vestStats.outer_radius, 0, 2 * Math.PI);
    constants.ctx.fill();
}

export function draw_players_backpack(socket_Id) {
    const equipment = players_equipment[socket_Id];
    if (!equipment || equipment.backpack === 0) return;

    const backpackTier = equipment.backpack;
    const offsetY = backpackStats[backpackTier].offset_y;

    constants.ctx.fillStyle = backpackStats.color;
    constants.ctx.beginPath();
    constants.ctx.arc(0, offsetY, backpackStats.radius, 0, 2 * Math.PI);
    constants.ctx.fill();
}

export function update_player_equipment(socket_Id, equipment) {
    if (!players_equipment[socket_Id]) {
        players_equipment[socket_Id] = { helmet: 0, vest: 0, backpack: 0 };
    }
    if ('helmet' in equipment) {
        players_equipment[socket_Id].helmet = equipment.helmet;
    }
    if ('vest' in equipment) {
        players_equipment[socket_Id].vest = equipment.vest;
    }
    if ('backpack' in equipment) {
        players_equipment[socket_Id].backpack = equipment.backpack;
    }
}
