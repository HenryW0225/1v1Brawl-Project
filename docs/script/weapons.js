import * as images from './images.js';
import * as input from './input.js';
import * as constants from './constants.js';

let assault_rife = {
    damage: 5,
    ammo: 30,
    width: 15,
    height: 30,
    speed: 20,
    range: 60
}

let assault_rife_bullets = [];

let shotgun = {
    damage: 5,
    ammo: 5,
    bullet_amount: 6,
    spread: Math.PI / 16,
    width: 10,
    height: 20,
    speed: 25,
    range: 20
}

let shotgun_bullets = [];

let isReloading = false;
let reloadTimeoutId = null;
let arSlowTimeoutId = null;
let shotgunSlowTimeoutId = null;

export function fire_assault_rife() {
    if (input.mouseDown && assault_rife.ammo != 0 && input.canFire) {
        if (isReloading) {
            clearTimeout(reloadTimeoutId);
            isReloading = false;
            reloadTimeoutId = null;
        }
        input.canFire = false;
        assault_rife.ammo -= 1;
        assault_rife_bullets.push({
            world_x: constants.player.world_x - constants.position_x + constants.ctx_width / 2,
            world_y: constants.player.world_y - constants.position_y + constants.ctx_height / 2,
            angle: constants.player.angle - Math.PI/2,
            distance: 0
        })

        assault_rife_slow();
    }
}
export function fire_shotgun() {
    if (input.mouseDown && shotgun.ammo != 0 && input.canFire) {
        if (isReloading) {
            clearTimeout(reloadTimeoutId);
            isReloading = false;
            reloadTimeoutId = null;
        }
        shotgun.ammo -= 1;
        for (let i = 0; i < shotgun.bullet_amount; i++) {
            shotgun_bullets.push({
                world_x: constants.player.world_x - constants.position_x + constants.ctx_width / 2,
                world_y: constants.player.world_y - constants.position_y + constants.ctx_height / 2,
                angle: constants.player.angle + Math.random() * shotgun.spread - shotgun.spread/2 - Math.PI/2,
                distance: 0
            })
        }

        shotgun_slow();
    }
}

export function game_assault_rife() {
    move_assault_rife_bullets();
    draw_assault_rife_bullets();
}

export function game_shotgun() {
    move_shotgun_bullets();
    draw_shotgun_bullets();
}

function move_assault_rife_bullets() {
    for (let i = assault_rife_bullets.length - 1; i >= 0; i--) {
        let bullet = assault_rife_bullets[i];
        bullet.distance += 1;
        bullet.world_x += Math.cos(bullet.angle) * assault_rife.speed;
        bullet.world_y += Math.sin(bullet.angle) * assault_rife.speed;
        if (bullet.world_x < 0 || bullet.world_x > constants.world_width || bullet.world_y < 0 || bullet.world_y > constants.world_height || bullet.distance > assault_rife.range) {
            assault_rife_bullets.splice(i, 1);
        }
    }
}

function draw_assault_rife_bullets() {
    for (let bullet of assault_rife_bullets) {
        constants.ctx.save();
        constants.ctx.translate(bullet.world_x, bullet.world_y);
        constants.ctx.rotate(bullet.angle - Math.PI/2);
        constants.ctx.drawImage(images.bulletImg, -assault_rife.width/2, -assault_rife.height/2, assault_rife.width, assault_rife.height);
        constants.ctx.restore();
    }
}

function assault_rife_slow() {
    constants.player.speed = 2.5;
    clearTimeout(arSlowTimeoutId);
    arSlowTimeoutId = setTimeout(() => {
        constants.player.speed = 5;
    }, 500); 
}

function move_shotgun_bullets() {
    for (let i = shotgun_bullets.length - 1; i >= 0; i--) {
        let bullet = shotgun_bullets[i];
        bullet.distance += 1;
        bullet.world_x += Math.cos(bullet.angle) * shotgun.speed;
        bullet.world_y += Math.sin(bullet.angle) * shotgun.speed;
        if (bullet.world_x < 0 || bullet.world_x > constants.world_width || bullet.world_y < 0 || bullet.world_y > constants.world_height || bullet.distance > shotgun.range) {
            shotgun_bullets.splice(i, 1);
        }
    }
}

function draw_shotgun_bullets() {
    for (let bullet of shotgun_bullets) {
        constants.ctx.save();
        constants.ctx.translate(bullet.world_x, bullet.world_y);
        constants.ctx.rotate(bullet.angle - Math.PI/2);
        constants.ctx.drawImage(images.bulletImg, -shotgun.width/2, -shotgun.height/2, shotgun.width, shotgun.height);
        constants.ctx.restore();
    }
}

function shotgun_slow() {
    constants.player.speed = 2.5;
    clearTimeout(shotgunSlowTimeoutId);
    shotgunSlowTimeoutId = setTimeout (() => {
        constants.player.speed = 5;
    }, 1000);
}

export function switch_weapons() {
    if (input.keys["Digit1"] && constants.player.weapon != 1) {
        constants.player.speed = 5;
        clearTimeout(reloadTimeoutId);
        isReloading = false;
        reloadTimeoutId = null;
        constants.player.weapon = 1;
        clearTimeout(shotgunSlowTimeoutId);
    } 
    else if (input.keys["Digit2"] && constants.player.weapon != 2) {
        constants.player.speed = 5;
        clearTimeout(reloadTimeoutId);
        isReloading = false;
        reloadTimeoutId = null;
        constants.player.weapon = 2;
        clearTimeout(arSlowTimeoutId);
    }
}

export function weapons_reload() {
    if (input.keys["KeyR"] && !isReloading) {
        if (constants.player.weapon === 1 && assault_rife.ammo < 30) {
            isReloading = true;
            reloadTimeoutId = setTimeout(() => {
                assault_rife.ammo = 30;
                isReloading = false;
                reloadTimeoutId = null;
            }, 2000);
        }
        else if (constants.player.weapon === 2 && shotgun.ammo < 5) {
            isReloading = true;
            for (let i = shotgun.ammo; i < 5; i++) {
                reloadTimeoutId = setTimeout(() => {
                    i += 1;
                    shotgun.ammo += 1;
                    isReloading = false;
                    reloadTimeoutId = null;
                }, 750);
            }
        }
    }
}