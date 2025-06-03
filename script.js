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

canvas.width = 1000;
canvas.height = 600;

let world_width = 2000;
let world_height = 1200;


let player = {
    world_x: 250,
    world_y: 600,
    width: 60,
    height: 60,
    health: 100,
    angle: 0
}

let assault_rife = {
    damage: 5,
    ammo: 30,
    width: 15,
    height: 30,
    speed: 10
}

let assault_rife_bullets = [];

/*let shotgun = {
    
}

let shotgun_bullets = [];*/

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
    if (keys["KeyA"]) player.world_x -= 5;
    if (keys["KeyD"]) player.world_x += 5;
    if (keys["KeyW"]) player.world_y -= 5;
    if (keys["KeyS"]) player.world_y += 5;
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
    for (let bullet of assault_rife_bullets) {
        bullet.world_x += Math.floor(Math.cos(bullet.angle) * assault_rife.speed);
        bullet.world_y += Math.floor(Math.sin(bullet.angle) * assault_rife.speed);
    }
}

function draw_assault_rife_bullets() {
    for (let bullet of assault_rife_bullets) {
        ctx.save();
        ctx.translate(bullet.world_x, bullet.world_y);
        ctx.rotate(bullet.angle);
        ctx.drawImage(images.assaultrifebulletImg, -assault_rife.width/2, -assault_rife.height/2, assault_rife.width, assault_rife.height);
        ctx.restore();
    }
}

function gameLoop() {
    background_map();
    move_player();
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
    if (event.code === "KeyR" && !gameOver) {
        assault_rife.ammo = 30;
    }
})

window.addEventListener("mousedown", () => {
    if (!gameOver && assault_rife.ammo != 0) {
        assault_rife.ammo -= 1;
        assault_rife_bullets.push({
            world_x: player.world_x - position_x + canvas.width / 2,
            world_y: player.world_y - position_y + canvas.height / 2,
            angle: player.angle - Math.PI/2
        })
    }
});



