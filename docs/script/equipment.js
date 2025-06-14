import * as constants from './constants.js';

export const helmetStats = {
    1: { color: '#2F74FF', protection: 5 },
    2: { color: '#F2F2F5', protection: 10 },
    3: { color: '#262626', protection: 15 },
    outer_color: '#000000',
    inner_radius: 11,
    outer_radius: 13,
    offset_y: 6
};

export const vestStats = {
    1: '#c0c0c0',
    2: '#505050',
    3: '#000000',
    outer_radius: 23.5
};

export const backpackStats = {
    0: { ar_ammo: 10, sg_ammo: 2 }, 
    1: { ar_ammo: 15, sg_ammo: 3, offset_y: 10 },
    2: { ar_ammo: 25, sg_ammo: 5, offset_y: 14 },
    3: { ar_ammo: 40, sg_ammo: 8, offset_y: 18 },
    color: '#816537',
    radius: 18
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

export function equipment_upgrade(socket_Id) {
    const equipment = players_equipment[socket_Id];
    if (!equipment) return;

    const upgradeable = [];

    if (equipment.helmet < 3) upgradeable.push('helmet');
    if (equipment.vest < 3) upgradeable.push('vest');
    if (equipment.backpack < 3) upgradeable.push('backpack');

    if (upgradeable.length === 0) return; 

    const type = upgradeable[Math.floor(Math.random() * upgradeable.length)];
    const upgradeAmount = Math.floor(Math.random() * 3) + 1; 
    equipment[type] = Math.min(3, equipment[type] + upgradeAmount);
}
