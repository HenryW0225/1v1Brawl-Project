import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';
import * as session from './session.js';
import * as equipment from './equipment.js';
import * as crates from './crates.js';
import * as sounds from './sounds.js';
import { socket } from './socket.js';

export let ar_ammo = 0;
export let sg_ammo = 0;
export let ms_ammo = 0;

export let assault_rife = {
    ammo: equipment.backpackStats[0].ar_ammo
};

export let shotgun = {
    ammo: equipment.backpackStats[0].sg_ammo,
    bullet_amount: 7,
    spread: Math.PI / 16
};

export let mosin = {
    ammo: equipment.backpackStats[0].ms_ammo
}

export const bulletStats = {
    1: { speed: 15, range: 60, damage: -5, width: 15, height: 30 },
    2: { speed: 20, range: 25, damage: -5, width: 10, height: 20 },
    3: { speed: 25, range: 80, damage: -27.5, width: 20, height: 35} 
};

export let bullets = [];
let pendingBullets = [];

let isReloading = false;
let arReloadTimeoutId = null;
let sgReloadIntervalId = null;
let msReloadIntervalId = null;
let arSlowTimeoutId = null;
let sgSlowTimeoutId = null;
let msSlowTimeoutId = null;

function cancelReload() {
    if (arReloadTimeoutId) clearTimeout(arReloadTimeoutId);
    if (sgReloadIntervalId) clearInterval(sgReloadIntervalId);
    if (msReloadIntervalId) clearInterval(msReloadIntervalId);
    arReloadTimeoutId = null;
    sgReloadIntervalId = null;
    msReloadIntervalId = null;
    
    isReloading = false;
    if (bandages.bandageTimer) clearTimeout(bandages.bandageTimer);
    bandages.bandageTimer = null;
    sounds.cancelReload();
}

function slowPlayer(timeoutId, duration, setIdFn) {
    session.player.speed = 2.5;
    clearTimeout(timeoutId);
    setIdFn(setTimeout(() => {
        session.player.speed = 5;
        setIdFn(null);
    }, duration));
}

export function fire_assault_rife() {
    if (input.firing.mouseDown && input.firing.canFire && assault_rife.ammo > 0) {
        cancelReload();
        sounds.playClonedSound(sounds.arshotSound);
        input.firing.canFire = false;
        assault_rife.ammo--;

        socket.emit('fire-bullet', { 
            roomCode: session.roomCode,
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            angle: session.player.angle - Math.PI/2,
            type: 1,
            distance: 0
        });

        socket.emit('proximity-sound-request', { 
            roomCode: session.roomCode,
            audio: "arshot",
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            distance: sounds.proximity_range
        });

        slowPlayer(arSlowTimeoutId, 500, id => arSlowTimeoutId = id);
    }
}

export function fire_shotgun() {
    if (input.firing.mouseDown && input.firing.canFire && shotgun.ammo > 0 && sgSlowTimeoutId === null) {
        cancelReload();
        sounds.playSound(sounds.sgshotSound);
        input.firing.canFire = false;
        shotgun.ammo--;

        for (let i = 0; i < shotgun.bullet_amount; i++) {
            socket.emit('fire-bullet', {
                roomCode: session.roomCode,
                world_x: session.player.world_x,
                world_y: session.player.world_y,
                angle: session.player.angle - Math.PI/2 + (Math.random() * shotgun.spread - shotgun.spread / 2),
                type: 2,
                distance: 0
            });
        }

        socket.emit('proximity-sound-request', { 
            roomCode: session.roomCode,
            audio: "sgshot",
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            distance: sounds.proximity_range
        });

        slowPlayer(sgSlowTimeoutId, 1000, id => sgSlowTimeoutId = id);
    }
}

export function fire_mosin() {
    if (input.firing.mouseDown && input.firing.canFire && mosin.ammo > 0 && msSlowTimeoutId === null) {
        cancelReload();
        sounds.playSound(sounds.msshotSound);
        input.firing.canFire = false;
        mosin.ammo--;

        socket.emit('fire-bullet', {
            roomCode: session.roomCode,
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            angle: session.player.angle - Math.PI/2,
            type: 3,
            distance: 0
        });

        socket.emit('proximity-sound-request', { 
            roomCode: session.roomCode,
            audio: "msshot",
            world_x: session.player.world_x,
            world_y: session.player.world_y,
            distance: sounds.proximity_range
        });

        slowPlayer(msSlowTimeoutId, 1500, id => msSlowTimeoutId = id);
    }
}

export function weapons_reload() {
    if (!input.keys["KeyR"] || isReloading) return;
    cancelReload();
    session.player.speed = 5;

    if (session.player.weapon === 1 && assault_rife.ammo < ar_ammo) {
        isReloading = true;
        sounds.playSound(sounds.arReloadingSound);
        arReloadTimeoutId = setTimeout(() => {
            assault_rife.ammo = ar_ammo;
            isReloading = false;
            arReloadTimeoutId = null;
        }, 1750);
    } else if (session.player.weapon === 2 && shotgun.ammo < sg_ammo) {
        isReloading = true;
        sounds.playSound(sounds.sgReloadingSound);
        sgReloadIntervalId = setInterval(() => {
            sounds.playSound(sounds.sgReloadingSound);
            if (shotgun.ammo < sg_ammo) {
                shotgun.ammo++;
            }
            if (shotgun.ammo >= sg_ammo) {
                cancelReload();
            }
        }, 800);
    }
    else if (session.player.weapon === 3 && mosin.ammo < ms_ammo) {
        isReloading = true;
        sounds.playSound(sounds.msReloadingSound);
        msReloadIntervalId = setInterval(() => {
            sounds.playSound(sounds.msReloadingSound);
            if (mosin.ammo < ms_ammo) {
                mosin.ammo++;
            }
            if (mosin.ammo >= ms_ammo) {
                cancelReload();
            }
        }, 1250);
    }
}

export function update_ammo() {
    const equip = equipment.players_equipment[session.player.socket_Id];
    if (!equip) {
        console.warn("Missing equipment for player:", session.player.socket_Id);
        return;
    }

    ar_ammo = equipment.backpackStats[equip.backpack].ar_ammo;
    sg_ammo = equipment.backpackStats[equip.backpack].sg_ammo;
    ms_ammo = equipment.backpackStats[equip.backpack].ms_ammo;

    document.getElementById("arAmmoMax").textContent = ar_ammo;
    document.getElementById("sgAmmoMax").textContent = sg_ammo;
    document.getElementById("msAmmoMax").textContent = ms_ammo;
}

export function switch_weapons() {
    if (input.keys["Digit1"] && session.player.weapon !== 1) {
        cancelReload();
        session.player.weapon = 1;
        session.player.speed = 5;
    } else if (input.keys["Digit2"] && session.player.weapon !== 2) {
        cancelReload();
        session.player.weapon = 2;
        session.player.speed = 5;
    } else if (input.keys["Digit3"] && session.player.weapon  !== 3) {
        cancelReload();
        session.player.weapon = 3;
        session.player.speed = 5;
    }
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

            if (dist < 27.5 && !bullet.hit) {
                bullet.hit = true;
                socket.emit('player-hit', {
                    roomCode: session.roomCode,
                    damage: stats.damage,
                    bulletId: bullet.bulletId,
                    protection: equipment.helmetStats[equipment.players_equipment[session.player.socket_Id].helmet].protection +
                                equipment.vestStats[equipment.players_equipment[session.player.socket_Id].vest].protection
                });

                socket.emit('proximity-sound-request', { 
                    roomCode: session.roomCode,
                    audio: "bullethit",
                    world_x: session.player.world_x,
                    world_y: session.player.world_y,
                    distance: sounds.proximity_range
                });
                continue;
            }
        } else {
            crates.bullet_check(bullet, stats.damage);
        }

        if (bullet.distance > stats.range) {
            bullets.splice(i, 1);
        }
    }

    bullets.push(...pendingBullets);
    pendingBullets.length = 0;
}

export function draw_bullets(screen) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const stats = bulletStats[bullet.type];

        constants.ctx.save();
        constants.ctx.translate(bullet.world_x - screen.camera_x, bullet.world_y - screen.camera_y);
        constants.ctx.rotate(bullet.angle + Math.PI/2);
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

export function weapons_reset() {
    assault_rife.ammo = equipment.backpackStats[0].ar_ammo;
    shotgun.ammo = equipment.backpackStats[0].sg_ammo;
    mosin.ammo = equipment.backpackStats[0].ms_ammo;
    bullets.length = 0;
    pendingBullets.length = 0;
    cancelReload();
    bandages.amount = 5;
    session.player.weapon = 1;
    session.player.speed = 5;
}
