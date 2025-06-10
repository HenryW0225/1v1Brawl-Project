export const createBtn = document.getElementById("createBtn");
export const joinBtn = document.getElementById("joinBtn");
export const usernameInput = document.getElementById("usernameInput");
export const enterBtn = document.getElementById("enterBtn");
export const codeInput = document.getElementById("codeInput");
export const startBtn = document.getElementById("startBtn");

let playerName = "";
//let roomCode = "-1";

export function create_button() {
    const name = usernameInput.value.trim();
    if (name !== "") {
        playerName = name;
        document.getElementById("startMenu").style.display = "none";
        loading_page();
    } else {
        alert("Please enter a username");
    }
}

export function join_button() {
    const name = usernameInput.value.trim();
    if (name !== "") {
        playerName = name;
        document.getElementById("startMenu").style.display = "none";
        enter_code_page();
    } else {
        alert("Please enter a username");
    }
}

export function enter_button() {
    const code = codeInput.value.trim();
    if (code !== "-1") {
        document.getElementById("enterCodePage").style.display = "none";
        loading_page();
    } else {
        alert("wrong room code");
    }
}

export function start_button() {
    document.getElementById("loadingPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
}

function loading_page() {
    document.getElementById("roomCode").textContent = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    document.getElementById("loadingPage").style.display = "block";
}

function enter_code_page() {
    document.getElementById("enterCodePage").style.display = "block";
}

