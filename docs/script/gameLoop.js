import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';
import * as session from './session.js';
import * as crates from './crates.js';
import * as constants from './constants.js';
import { socket } from './socket.js';

let lastServerUpdate = 0;
let lastCrateSpawn = 0;

let game_running = true;

export let screen = {
    camera_x: 0,
    camera_y: 0
}

export function start_game_loop() {
    game_running = true;
}

export function stop_game_loop() {
    game_running = false;
}

export function game_loop(timestamp) {
    if (!game_running) {
        return;
    }


    document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; 
    document.getElementById("msAmmo").textContent = weapons.mosin.ammo;
    document.getElementById("bandagesAmount").textContent = weapons.bandages.amount; 

    screen.camera_x = Math.max(0, Math.min(session.player.world_x - constants.ctx_width / 2, constants.world_width - constants.ctx_width));
    screen.camera_y = Math.max(0, Math.min(session.player.world_y - constants.ctx_height / 2, constants.world_height - constants.ctx_height));

    players.move_player_locally(screen);
    layout.background_map(screen);

    if (timestamp - lastServerUpdate >= 50) {
        players.update_player_server();
        lastServerUpdate = timestamp;
    }
    if (session.player.weapon === 1) {
        weapons.fire_assault_rife();
    }
    else if (session.player.weapon === 2) {
        weapons.fire_shotgun();
    }
    else if (session.player.weapon === 3) {
        weapons.fire_mosin();
    }

    if (Math.random() < 0.00035 && timestamp - lastCrateSpawn >= 1000) {
        lastCrateSpawn = timestamp;
        const newCrates = crates.create_crates(1, 1);
        socket.emit('create-crates', { roomCode: session.roomCode, new_crates: newCrates});
    }

    weapons.use_bandage();
    weapons.switch_weapons();
    weapons.weapons_reload();
    weapons.move_bullets();
    weapons.draw_bullets(screen);


    crates.draw_crates(screen);

    players.draw_player(screen);
    players.draw_opponent_players(screen);
    requestAnimationFrame(game_loop);
}
