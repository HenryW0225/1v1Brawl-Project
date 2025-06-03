const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("usernameInput");
const enterBtn = document.getElementById("enterBtn");
const codeInput = document.getElementById("codeInput");
const startBtn = document.getElementById("startBtn");

import * as images from './images.js';

let playerName = "";
let roomCode = "-1";
let gameOver = true;
let WorldMap;

canvas.width = 1250;
canvas.height = 750;

let world_width = canvas.width*2;
let world_height = canvas.height*2;

let player = {
    world_x: 250,
    world_y: canvas.height,
    angle: 0,
    width: 50,
    height: 50,
    health: 100,
    speed: 5,
    arSlowTimeoutId: null,
    shotgunSlowTimeoutId: null,
    weapon: 1
}

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


let keys = {};

let position_x = 0;
let position_y = 0;

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

createBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (name !== "") {
        playerName = name;
        document.getElementById("startMenu").style.display = "none";
        loading_page();
    } else {
        alert("Please enter a username");
    }
});

joinBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (name !== "") {
        playerName = name;
        document.getElementById("startMenu").style.display = "none";
        enter_code_page();
    } else {
        alert("Please enter a username");
    }
});

enterBtn.addEventListener("click", () => {
    const code = codeInput.value.trim();
    if (code !== "-1") {
        document.getElementById("enterCodePage").style.display = "none";
        loading_page();
    } else {
        alert("wrong room code");
    }
});

function loading_page() {
    document.getElementById("roomCode").textContent = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    document.getElementById("loadingPage").style.display = "block";
}

function enter_code_page() {
    document.getElementById("enterCodePage").style.display = "block";
}

startBtn.addEventListener("click", () => {
    document.getElementById("loadingPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    gameOver = false;
    gameLoop();
});


images.originalworldmapImg.onload = () => {
    const offscreen = document.createElement("canvas");
    offscreen.width = world_width;
    offscreen.height = world_height;
    const offCtx = offscreen.getContext("2d");
    offCtx.drawImage(images.originalworldmapImg, 0, 0, world_width, world_height);
    WorldMap = offscreen;
};


function background_map() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    position_x = Math.max(Math.min(player.world_x, world_width - canvas.width/2), canvas.width/2);
    position_y = Math.max(Math.min(player.world_y, world_height - canvas.height/2), canvas.height/2);
    ctx.drawImage(WorldMap, position_x - canvas.width/2, position_y - canvas.height/2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

function move_player() {
    let dx = 0;
    let dy = 0;
    if (keys["KeyA"]) dx -= 1;
    if (keys["KeyD"]) dx += 1;
    if (keys["KeyW"]) dy -= 1;
    if (keys["KeyS"]) dy += 1;

    const length = Math.hypot(dx, dy);
    if (length > 0) {
        dx = (dx / length) * player.speed;
        dy = (dy / length) * player.speed;
    }
    player.world_x += dx;
    player.world_y += dy;

    player.world_x = Math.max(0, Math.min(world_width, player.world_x));
    player.world_y = Math.max(0, Math.min(world_height, player.world_y));
}

function draw_player() {
    const offsetX = player.world_x - position_x + canvas.width / 2;
    const offsetY = player.world_y - position_y + canvas.height / 2;

    const worldMouseX = mouseX + position_x - canvas.width / 2;
    const worldMouseY = mouseY + position_y - canvas.height / 2;

    const dx = worldMouseX - player.world_x;
    const dy = worldMouseY - player.world_y;
    player.angle = Math.atan2(dy, dx) + Math.PI/2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.rotate(player.angle);
    ctx.drawImage(images.playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();

}

function move_assault_rife_bullets() {
    for (let i = assault_rife_bullets.length - 1; i >= 0; i--) {
        let bullet = assault_rife_bullets[i];
        bullet.distance += 1;
        bullet.world_x += Math.cos(bullet.angle) * assault_rife.speed;
        bullet.world_y += Math.sin(bullet.angle) * assault_rife.speed;
        if (bullet.world_x < 0 || bullet.world_x > world_width || bullet.world_y < 0 || bullet.world_y > world_height || bullet.distance > assault_rife.range) {
            assault_rife_bullets.splice(i, 1);
        }
    }
}

function draw_assault_rife_bullets() {
    for (let bullet of assault_rife_bullets) {
        ctx.save();
        ctx.translate(bullet.world_x, bullet.world_y);
        ctx.rotate(bullet.angle - Math.PI/2);
        ctx.drawImage(images.assaultrifebulletImg, -assault_rife.width/2, -assault_rife.height/2, assault_rife.width, assault_rife.height);
        ctx.restore();
    }
}

function assault_rife_slow() {
    player.speed = 2;
    clearTimeout(player.arSlowTimeoutId);
    player.arSlowTimeoutId = setTimeout(() => {
        player.speed = 5;
    }, 300); 
}

function move_shotgun_bullets() {
    for (let i = shotgun_bullets.length - 1; i >= 0; i--) {
        let bullet = shotgun_bullets[i];
        bullet.distance += 1;
        bullet.world_x += Math.cos(bullet.angle) * shotgun.speed;
        bullet.world_y += Math.sin(bullet.angle) * shotgun.speed;
        if (bullet.world_x < 0 || bullet.world_x > world_width || bullet.world_y < 0 || bullet.world_y > world_height || bullet.distance > shotgun.range) {
            shotgun_bullets.splice(i, 1);
        }
    }
}

function draw_shotgun_bullets() {
    for (let bullet of shotgun_bullets) {
        ctx.save();
        ctx.translate(bullet.world_x, bullet.world_y);
        ctx.rotate(bullet.angle - Math.PI/2);
        ctx.drawImage(images.assaultrifebulletImg, -assault_rife.width/2, -assault_rife.height/2, assault_rife.width, assault_rife.height);
        ctx.restore();
    }
}

function shotgun_slow() {
    player.speed = 2;
    clearTimeout(player.shotgunSlowTimeoutId);
    player.shotgunSlowTimeoutId = setTimeout (() => {
        player.speed = 5;
        player.shotgunSlowTimeoutId = null;
    }, 500);
}

function gameLoop() {
    document.getElementById("arAmmo").textContent = assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = shotgun.ammo; 

    background_map();
    move_player();
    move_shotgun_bullets();
    draw_shotgun_bullets();
    move_assault_rife_bullets();
    draw_assault_rife_bullets();
    draw_player();


    requestAnimationFrame(gameLoop);
}


document.addEventListener("keydown", function(event) {
    keys[event.code] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.code] = false;
});

document.addEventListener("keydown", function(event) {
    if (event.code === "KeyR" && !gameOver && !isReloading) {
        if (player.weapon === 1 && assault_rife.ammo < 30) {
            isReloading = true;
            reloadTimeoutId = setTimeout(() => {
                assault_rife.ammo = 30;
                isReloading = false;
                reloadTimeoutId = null;
            }, 2000);
        }
        else if (player.weapon === 2 && shotgun.ammo < 5) {
            isReloading = true;
            reloadTimeoutId = setTimeout(() => {
                shotgun.ammo += 1;
                isReloading = false;
                reloadTimeoutId = null;
            }, 750);
        }
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Digit1" && player.weapon != 1) {
        player.speed = 5;
        clearTimeout(reloadTimeoutId);
        isReloading = false;
        reloadTimeoutId = null;
        player.weapon = 1;
        clearTimeout(player.shotgunSlowTimeoutId);
    } 
    else if (event.code === "Digit2" && player.weapon != 2) {
        player.speed = 5;
        clearTimeout(reloadTimeoutId);
        isReloading = false;
        reloadTimeoutId = null;
        player.weapon = 2;
        clearTimeout(player.arSlowTimeoutId);
    }
});

window.addEventListener("mousedown", () => {
    if (!gameOver) {
        if (player.weapon === 1 && assault_rife.ammo != 0) {
            if (isReloading) {
                clearTimeout(reloadTimeoutId);
                isReloading = false;
                reloadTimeoutId = null;
            }
            assault_rife.ammo -= 1;
            assault_rife_bullets.push({
                world_x: player.world_x - position_x + canvas.width / 2,
                world_y: player.world_y - position_y + canvas.height / 2,
                angle: player.angle - Math.PI/2,
                distance: 0
            })

            assault_rife_slow();
        }
        else if (player.weapon === 2 && shotgun.ammo != 0 && player.shotgunSlowTimeoutId === null) {
            shotgun.ammo -= 1;
            for (let i = 0; i < shotgun.bullet_amount; i++) {
                shotgun_bullets.push({
                    world_x: player.world_x - position_x + canvas.width / 2,
                    world_y: player.world_y - position_y + canvas.height / 2,
                    angle: player.angle + Math.random() * shotgun.spread - shotgun.spread/2,
                    distance: 0
                })
            }

            shotgun_slow();
        }
    }
});



