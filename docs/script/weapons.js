import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import { socket } from './socket.js';

export let assault_rife = {
    ammo: 30,
};

export let shotgun = {
    ammo: 5,
    bullet_amount: 6,
    spread: Math.PI / 16,
};

export const bulletStats = {
    1: { // Assault Rifle
        speed: 15,
        range: 60,
        damage: -5,
        width: 15,
        height: 30
    },
    2: { // Shotgun
        speed: 20,
        range: 20,
        damage: -3,
        width: 10,
        height: 20
    }
};

export let bullets = [];
let pendingBullets = [];

let isReloading = false;
let arReloadTimeoutId = null;
let sgReloadIntervalId = null;
let arSlowTimeoutId = null;
let sgSlowTimeoutId = null;

function cancelReload() {
    if (arReloadTimeoutId !== null) {
        clearTimeout(arReloadTimeoutId);
        arReloadTimeoutId = null;
    }
    if (sgReloadIntervalId !== null) {
        clearInterval(sgReloadIntervalId);
        sgReloadIntervalId = null;
    }
    isReloading = false;
    clearTimeout(bandages.bandageTimer);
}

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

        slowPlayer(arSlowTimeoutId, 500, (id) => arSlowTimeoutId = id);
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
        slowPlayer(sgSlowTimeoutId, 1000, (id) => sgSlowTimeoutId = id);
    }
}

export function weapons_reload() {
    if (!input.keys["KeyR"] || isReloading) return;
    if (session.player.weapon === 1 && assault_rife.ammo < 30) {
        isReloading = true;
        arReloadTimeoutId = setTimeout(() => {
            assault_rife.ammo = 30;
            isReloading = false;
            arReloadTimeoutId = null;
        }, 2000);
    } else if (session.player.weapon === 2 && shotgun.ammo < 5) {
        isReloading = true;
        sgReloadIntervalId = setInterval(() => {
            if (shotgun.ammo < 5) {
                shotgun.ammo++;
            }
            if (shotgun.ammo >= 5) {
                cancelReload();
            }
        }, 1000);
    }
}

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

function slowPlayer(timeoutId, duration, setIdFn) {
    session.player.speed = 2.5;
    clearTimeout(timeoutId);
    setIdFn(setTimeout(() => {
        session.player.speed = 5;
        setIdFn(null);
    }, duration));
}

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
                socket.emit('player-hit', { roomCode: session.roomCode, damage: stats.damage, bulletId: bullet.bulletId});
                continue;
            }
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

export function weapons_reset() {
    assault_rife.ammo = 30;
    shotgun.ammo = 5;
    bullets.length = 0;
    pendingBullets.length = 0;
    cancelReload();
    clearTimeout(arSlowTimeoutId);
    clearTimeout(sgSlowTimeoutId);
    clearTimeout(bandages.bandageTimer);
    session.player.speed = 5;
    session.player.weapon = 1;
}

export let bandages = {
    amount: 5,
    bandageTimer: null,
    healing: 15
}

export function use_bandage() {
    if (input.keys["KeyE"] && bandages.amount > 0 && bandages.bandageTimer === null && session.player.health < 100) {
        session.player.speed = 1.5;
        bandages.bandageTimer = setTimeout(() => {
            socket.emit('used-bandage', { roomCode: session.roomCode, damage: bandage.healing });
            bandages.amount--;
            bandages.bandageTimer = null;
            session.player.speed = 5;
        }, 2500);
    }
}









