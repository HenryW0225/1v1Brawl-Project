import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import * as crates from './crates.js';
import { socket } from './socket.js';

//
// ===== Weapon & Bullet Data =====
//

export let ar_ammo = 0;
export let sg_ammo = 0;

export let assault_rife = {
    ammo: equipment.backpackStats[0].ar_ammo
};

export let shotgun = {
    ammo: equipment.backpackStats[0].sg_ammo,
    bullet_amount: 7,
    spread: Math.PI / 16
};

export const bulletStats = {
    1: { speed: 15, range: 60, damage: -5, width: 15, height: 30 }, // AR
    2: { speed: 20, range: 20, damage: -5, width: 10, height: 20 }  // Shotgun
};

export let bullets = [];
let pendingBullets = [];

//
// ===== Timers & Reloading =====
//
let isReloading = false;
let arReloadTimeoutId = null;
let sgReloadIntervalId = null;
let arSlowTimeoutId = null;
let sgSlowTimeoutId = null;

function cancelReload() {
    if (arReloadTimeoutId) clearTimeout(arReloadTimeoutId);
    if (sgReloadIntervalId) clearInterval(sgReloadIntervalId);

    arReloadTimeoutId = null;
    sgReloadIntervalId = null;
    isReloading = false;

    if (bandages.bandageTimer) clearTimeout(bandages.bandageTimer);
    bandages.bandageTimer = null;
}

function slowPlayer(timeoutId, duration, setIdFn) {
    session.player.speed = 2.5;
    clearTimeout(timeoutId);
    setIdFn(setTimeout(() => {
        session.player.speed = 5;
        setIdFn(null);
    }, duration));
}

//
// ===== Firing =====
//
export function fire_assault_rife() {
    if (input.firing.mouseDown && input.firing.canFire && assault_rife.ammo > 0) {
        cancelReload();
        input.firing.canFire = false;
        assault_rife.ammo--;

        socket.emit('fire-bullet', { 
            roomCode: session.roomCode,
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            angle: session.player.angle - Math.PI / 2,
            type: 1,
            distance: 0
        });

        slowPlayer(arSlowTimeoutId, 500, id => arSlowTimeoutId = id);
    }
}

export function fire_shotgun() {
    if (input.firing.mouseDown && input.firing.canFire && shotgun.ammo > 0 && sgSlowTimeoutId === null) {
        cancelReload();
        input.firing.canFire = false;
        shotgun.ammo--;

        for (let i = 0; i < shotgun.bullet_amount; i++) {
            socket.emit('fire-bullet', {
                roomCode: session.roomCode,
                world_x: session.player.world_x,
                world_y: session.player.world_y,
                angle: session.player.angle - Math.PI / 2 + (Math.random() * shotgun.spread - shotgun.spread / 2),
                type: 2,
                distance: 0
            });
        }

        slowPlayer(sgSlowTimeoutId, 1000, id => sgSlowTimeoutId = id);
    }
}

//
// ===== Reloading =====
//
export function weapons_reload() {
    if (!input.keys["KeyR"] || isReloading) return;
    cancelReload();
    session.player.speed = 5;
    if (session.player.weapon === 1 && assault_rife.ammo < ar_ammo) {
        isReloading = true;
        arReloadTimeoutId = setTimeout(() => {
            assault_rife.ammo = ar_ammo;
            isReloading = false;
            arReloadTimeoutId = null;
        }, 2000);
    } else if (session.player.weapon === 2 && shotgun.ammo < sg_ammo) {
        isReloading = true;
        sgReloadIntervalId = setInterval(() => {
            if (shotgun.ammo < sg_ammo) {
                shotgun.ammo++;
            }
            if (shotgun.ammo >= sg_ammo) {
                cancelReload();
            }
        }, 1000);
    }
}

export function update_ammo() {
    ar_ammo = equipment.backpackStats[equipment.players_equipment[session.player.socket_Id].backpack].ar_ammo;
    sg_ammo = equipment.backpackStats[equipment.players_equipment[session.player.socket_Id].backpack].sg_ammo;
}

//
// ===== Switching Weapons =====
//
export function switch_weapons() {
    if (input.keys["Digit1"] && session.player.weapon !== 1) {
        cancelReload();
        clearTimeout(sgSlowTimeoutId);
        session.player.weapon = 1;
        session.player.speed = 5;
    } else if (input.keys["Digit2"] && session.player.weapon !== 2) {
        cancelReload();
        clearTimeout(arSlowTimeoutId);
        session.player.weapon = 2;
        session.player.speed = 5;
    }
}

//
// ===== Bullet Management =====
//
export function add_bullet(bullet) {
    pendingBullets.push(bullet);
}

export function move_bullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const stats = bulletStats[bullet.type];

        bullet.world_x += stats.speed * Math.cos(bullet.angle);
        bullet.world_y += stats.speed * Math.sin(bullet.angle);
        bullet.distance += 1;

        if (bullet.shooterId !== session.player.socket_Id) {
            const dx = bullet.world_x - session.player.world_x;
            const dy = bullet.world_y - session.player.world_y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 35 && !bullet.hit) {
                bullet.hit = true;
                socket.emit('player-hit', {
                    roomCode: session.roomCode,
                    damage: stats.damage,
                    bulletId: bullet.bulletId
                });
                continue;
            }
        }
        else {
            crates.bullet_check(bullet, stats.damage);
        }

        if (bullet.distance > stats.range) {
            bullets.splice(i, 1);
        }
    }

    bullets.push(...pendingBullets);
    pendingBullets.length = 0;
}

export function draw_bullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const stats = bulletStats[bullet.type];

        const camera_x = Math.max(0, Math.min(session.player.world_x - constants.ctx_width / 2, constants.world_width - constants.ctx_width));
        const camera_y = Math.max(0, Math.min(session.player.world_y - constants.ctx_height / 2, constants.world_height - constants.ctx_height));

        constants.ctx.save();
        constants.ctx.translate(bullet.world_x - camera_x, bullet.world_y - camera_y);
        constants.ctx.rotate(bullet.angle);
        constants.ctx.drawImage(
            images.bulletImg,
            -stats.width / 2,
            -stats.height / 2,
            stats.width,
            stats.height
        );
        constants.ctx.restore();
    }
}

//
// ===== Healing (Bandages) =====
//
export let bandages = {
    amount: 5,
    bandageTimer: null,
    healing: 15
};

export function use_bandage() {
    if (
        input.keys["KeyE"] &&
        bandages.amount > 0 &&
        bandages.bandageTimer === null &&
        session.player.health < 100 &&
        !isReloading
    ) {
        cancelReload();
        session.player.speed = 1.5;

        bandages.bandageTimer = setTimeout(() => {
            socket.emit('used-bandage', {
                roomCode: session.roomCode,
                damage: bandages.healing
            });
            bandages.amount--;
            bandages.bandageTimer = null;
            session.player.speed = 5;
        }, 2500);
    }
}

//
// ===== Reset State =====
//

export function weapons_reset() {
    assault_rife.ammo = ar_ammo;
    shotgun.ammo = sg_ammo;
    bullets.length = 0;
    pendingBullets.length = 0;
    cancelReload();
    clearTimeout(arSlowTimeoutId);
    clearTimeout(sgSlowTimeoutId);
    bandages.amount = 5;
    session.player.speed = 5;
    session.player.weapon = 1;
}
