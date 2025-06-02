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


canvas.width = 1000;
canvas.height = 600;

let world_width = 2000;
let world_height = 1200;

let player = {
    world_x: 250,
    world_y: 600,
    width: 100,
    height: 100
}

let position_x = 0;
let position_y = 0;

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
    const code = usernameInput.value.trim();
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

function background_map() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    position_x = Math.max(player.world_x, canvas.width/2);
    position_y = Math.max(player.world_y, canvas.height/2);
    position_x = Math.min(player.world_x, world_width - canvas.width/2);
    position_y = Math.min(player.world_y, world_height - canvas.height/2);
    ctx.drawImage(images.worldmapImg, position_x - canvas.width/2, position_y - canvas.height/2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    background_map();
    ctx.drawImage(images.playerIMG, canvas.width/2 - player.width/2, canvas.height/2 - player.height/2, player.width, player.height);
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event) {
    if (!gameOver) {
        if (event.code === "KeyA") {
            player.world_x -= 5;
        }
        if (event.code === "KeyD") {
            player.world_x += 5;
        }
        if (event.code === "KeyW") {
            player.world_y -= 5;
        }
        if (event.code === "KeyS") {
            player.world_y += 5;
        }
    }
})
