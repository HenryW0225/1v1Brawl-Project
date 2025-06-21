import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';
import * as session from './session.js';
import * as weapons from './weapons.js';
import * as input from './input.js';
import * as equipment from './equipment.js';
import * as crates from './crates.js';
import * as sounds from './sounds.js';
import * as players from './players.js';
import { socket } from './socket.js';

startUI.createBtn.addEventListener("click", () => {
    startUI.create_button();
    sounds.playSound(sounds.backgroundMusic);
});

startUI.joinBtn.addEventListener("click", () => {
    startUI.join_button();
    sounds.playSound(sounds.backgroundMusic);
});

startUI.enterBtn.addEventListener("click", () => {
    startUI.enter_button();
});

startUI.startBtn.addEventListener("click", () => {
    startUI.start_button();
});

socket.on('room-created', ({ roomCode, players }) => {
    session.player.socket_Id = socket.id;
    session.update_room_code(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-joined', ({ roomCode, players }) => {
    session.player.socket_Id = socket.id;
    document.getElementById("enterCodePage").style.display = "none";
    session.update_room_code(roomCode);
    startUI.updatePlayers(players);
    startUI.showLoadingPage();
});

socket.on('room-error', (msg) => {
    alert(msg);
});

socket.on('player-list-updated', (players) => {
    startUI.updatePlayers(players);
});

socket.on('game-started', () => {
    sounds.backgroundMusic.pause();
    gameLoop.start_game_loop();
    document.getElementById('healthBar').style.width = 100 + '%';
    document.getElementById('healthBarText').textContent = 100 + ' / 100';

    socket.emit('add-player-info', { roomCode: session.roomCode, player: session.player });
    document.getElementById("loadingPage").style.display = "none";
    if (images.originalworldmapImg.complete) {
        document.getElementById("gameContainer").style.display = "flex";
        layout.create_worldmap();
        requestAnimationFrame(gameLoop.game_loop);
    } else {
        images.originalworldmapImg.onload = () => {
            document.getElementById("gameContainer").style.display = "flex";
            layout.create_worldmap();
            requestAnimationFrame(gameLoop.game_loop);
        };
    }
});

socket.on('state-update', ({ players }) => {
    session.update_players(socket.id, players);
});

socket.on("remove-player", (id) => {
    if (session.opponent_players[id]) {
        delete session.opponent_players[id];
    }
});

socket.on('bullet-fired', (bullet) => {
    weapons.add_bullet(bullet);
});

socket.on('update-health', ({ newHealth} ) => {
    session.player.health = newHealth;
    newHealth = Math.ceil(newHealth);
    document.getElementById('healthBar').style.width = newHealth + '%';
    document.getElementById('healthBarText').textContent = newHealth + ' / 100';
});

socket.on('game-over', () => { 
    setTimeout(() => {
        session.players_reset();
        weapons.weapons_reset();
        input.reset();
        equipment.equipments_reset();
        crates.reset_crates();
        sounds.reset_sounds();

        document.getElementById("gameContainer").style.display = "none";
        document.getElementById("loadingPage").style.display = "block";
        sounds.playSound(sounds.backgroundMusic);
    }, 3500); 
});

socket.on('player-death', () => {
    sounds.playSound(sounds.playerDeathSound);
    gameLoop.stop_game_loop();
    layout.background_map(gameLoop.screen);
    weapons.draw_bullets(gameLoop.screen);
    crates.draw_crates(gameLoop.screen);
    players.draw_opponent_players(gameLoop.screen);

    layout.draw_defeat_sign();
}); 

socket.on('remove-bullet', (bulletId) => {
    const index = weapons.bullets.findIndex(bullet => bullet.bulletId === bulletId);
    if (index !== -1) {
        weapons.bullets.splice(index, 1);
    }
});

socket.on('update-player-equipment', (socket_Id, temp) => {
    equipment.update_player_equipment(socket_Id, {helmet: temp.helmet, vest: temp.vest, backpack: temp.backpack});
    weapons.update_ammo();
});

socket.on('crates-created', (new_crates) => {
    crates.add_crates(new_crates);
});

socket.on('crate-update-hp', ({ damage, crateId }) => {
    crates.update_crate_hp(crateId, damage);
});

socket.on('remove-crate', ({ crateId, playerId, new_equipment }) => {
    crates.destroy_crate(crateId);
    equipment.update_player_equipment(playerId, new_equipment);
    weapons.update_ammo();
});

socket.on('proximity-play-sound', ({ audio, world_x, world_y, distance }) => {
    const offset_x = session.player.world_x - world_x;
    const offset_y = session.player.world_y - world_y;
    if (Math.sqrt(offset_x*offset_x + offset_y*offset_y) <= distance) {
        if (audio === "arshot") {
            sounds.playClonedSound(sounds.arshotSound);
        } 
        else if (audio === "sgshot") {
            sounds.playClonedSound(sounds.sgshotSound);
        }
        else if (audio === "msshot") {
            sounds.playClonedSound(sounds.msshotSound);
        } 
        else if (audio === "cratebreaking") {
            sounds.playClonedSound(sounds.crateBreakingSound);
        }
        else if (audio === "bullethit") {
            sounds.playClonedSound(sounds.bulletHitSound);
        }
    }
});

socket.on('victory', () => {
    sounds.playSound(sounds.victorySound);
    gameLoop.stop_game_loop();
    layout.background_map(gameLoop.screen);
    weapons.draw_bullets(gameLoop.screen);
    crates.draw_crates(gameLoop.screen);
    players.draw_player(gameLoop.screen);

    layout.draw_victory_sign();
}); 

socket.on('starting-position', ({ world_x, world_y }) => {
    session.player.world_x = world_x;
    session.player.world_y = world_y;
});

//updates readme file