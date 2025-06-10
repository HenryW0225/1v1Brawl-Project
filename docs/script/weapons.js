import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';

export let assault_rife = {
    damage: 5,
    ammo: 30,
    width: 15,
    height: 30,
    speed: 20,
    range: 60
};

export let shotgun = {
    damage: 5,
    ammo: 5,
    bullet_amount: 6,
    spread: Math.PI / 16,
    width: 10,
    height: 20,
    speed: 25,
    range: 20
};

let assault_rife_bullets = [];
let shotgun_bullets = [];

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
}

export function fire_assault_rife() {
    if (input.firing.mouseDown && input.firing.canFire && assault_rife.ammo > 0) {
        cancelReload();
        input.firing.canFire = false;
        assault_rife.ammo--;

        assault_rife_bullets.push({
            world_x: constants.player.world_x - constants.player.position_x + constants.ctx_width / 2,
            world_y: constants.player.world_y - constants.player.position_y + constants.ctx_height / 2,
            angle: constants.player.angle - Math.PI / 2,
            distance: 0
        });

        slowPlayer(arSlowTimeoutId, 500, (id) => arSlowTimeoutId = id);
    }
}

// Fire Shotgun
export function fire_shotgun() {
    if (input.firing.mouseDown && input.firing.canFire && shotgun.ammo > 0 && sgSlowTimeoutId === null) {
        cancelReload();
        input.firing.canFire = false;
        shotgun.ammo--;

        for (let i = 0; i < shotgun.bullet_amount; i++) {
            shotgun_bullets.push({
                world_x: constants.player.world_x - constants.player.position_x + constants.ctx_width / 2,
                world_y: constants.player.world_y - constants.player.position_y + constants.ctx_height / 2,
                angle: constants.player.angle - Math.PI / 2 + (Math.random() * shotgun.spread - shotgun.spread / 2),
                distance: 0
            });
        }

        slowPlayer(sgSlowTimeoutId, 1000, (id) => sgSlowTimeoutId = id);
    }
}

export function weapons_reload() {
    if (!input.keys["KeyR"] || isReloading) return;

    if (constants.player.weapon === 1 && assault_rife.ammo < 30) {
        isReloading = true;
        arReloadTimeoutId = setTimeout(() => {
            assault_rife.ammo = 30;
            isReloading = false;
            arReloadTimeoutId = null;
        }, 2000);
    } else if (constants.player.weapon === 2 && shotgun.ammo < 5) {
        isReloading = true;
        sgReloadIntervalId = setInterval(() => {
            if (shotgun.ammo < 5) {
                shotgun.ammo++;
            }
            if (shotgun.ammo >= 5) {
                cancelReload();
            }
        }, 750);
    }
}

// Switch weapons
export function switch_weapons() {
    if (input.keys["Digit1"] && constants.player.weapon !== 1) {
        cancelReload();
        clearTimeout(sgSlowTimeoutId);
        constants.player.weapon = 1;
        constants.player.speed = 5;
    } else if (input.keys["Digit2"] && constants.player.weapon !== 2) {
        cancelReload();
        clearTimeout(arSlowTimeoutId);
        constants.player.weapon = 2;
        constants.player.speed = 5;
    }
}

function slowPlayer(timeoutId, duration, setIdFn) {
    constants.player.speed = 2.5;
    clearTimeout(timeoutId);
    setIdFn(setTimeout(() => {
        constants.player.speed = 5;
        setIdFn(null);
    }, duration));
}

export function game_assault_rife() {
    updateBullets(assault_rife_bullets, assault_rife);
    drawBullets(assault_rife_bullets, assault_rife);
}

export function game_shotgun() {
    updateBullets(shotgun_bullets, shotgun);
    drawBullets(shotgun_bullets, shotgun);
}

function updateBullets(bullets, weapon) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.distance++;
        b.world_x += Math.cos(b.angle) * weapon.speed;
        b.world_y += Math.sin(b.angle) * weapon.speed;

        if (b.distance > weapon.range ||
            b.world_x < 0 || b.world_x > constants.world_width ||
            b.world_y < 0 || b.world_y > constants.world_height) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets(bullets, weapon) {
    for (const b of bullets) {
        constants.ctx.save();
        constants.ctx.translate(b.world_x, b.world_y);
        constants.ctx.rotate(b.angle - Math.PI / 2);
        constants.ctx.drawImage(images.bulletImg, -weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
        constants.ctx.restore();
    }
}
