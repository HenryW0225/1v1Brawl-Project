export const createBtn = document.getElementById("createBtn");
export const joinBtn = document.getElementById("joinBtn");
export const usernameInput = document.getElementById("usernameInput");
export const enterBtn = document.getElementById("enterBtn");
export const codeInput = document.getElementById("codeInput");
export const startBtn = document.getElementById("startBtn");

import * as session from './session.js';
import * as crates from './crates.js';
import { socket } from './socket.js';

let playerName = "";

export function create_button() {
    const name = usernameInput.value.trim();
    if (name === "") {
        alert("Please enter a username");
        return;
    }
    playerName = name;

    socket.emit('create-room', { username: playerName });
    document.getElementById("startMenu").style.display = "none";
}

export function join_button() {
    const name = usernameInput.value.trim();
    if (name === "") {
        alert("Please enter a username");
        return;
    }
    playerName = name;
    document.getElementById("startMenu").style.display = "none";
    enter_code_page();
}

export function enter_button() {
    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
        alert("Please enter a room code");
        return;
    }
    socket.emit('join-room', { roomCode: code, username: playerName });
}

export function start_button() {
    const newCrates = crates.create_crates(5, 10);
    socket.emit('create-crates', { roomCode: session.roomCode, new_crates: newCrates});
    socket.emit('start-game', { roomCode: session.roomCode });
}

export function showLoadingPage() {
    document.getElementById("loadingPage").style.display = "block";
}

function enter_code_page() {
    document.getElementById("enterCodePage").style.display = "block";
}

export function updatePlayers(players) {
    const tbody = document.querySelector("#players tbody");
    tbody.innerHTML = "";
    players.forEach(player => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = player.name;
        tr.appendChild(td);
        tbody.appendChild(tr);
    });
}
