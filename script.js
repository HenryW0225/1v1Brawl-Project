const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("usernameInput");
const enterBtn = document.getElementById("enterBtn");
const codeInput = document.getElementById("codeInput");

let playerName = "";
let roomCode = "-1";

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
   update_game() 
});

function start_game() {
    document.getElementById("loadingPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    


}
