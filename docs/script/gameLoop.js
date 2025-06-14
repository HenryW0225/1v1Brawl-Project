import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';
import * as session from './session.js';
import * as crates from './crates.js';

let lastServerUpdate = 0;

let game_running = true;

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
    document.getElementById("bandagesAmount").textContent = weapons.bandages.amount; 

    layout.background_map();
    players.move_player_locally();

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

    weapons.use_bandage();
    weapons.switch_weapons();
    weapons.weapons_reload();
    weapons.move_bullets();
    weapons.draw_bullets();

    crates.draw_crates();

    players.draw_player();
    players.draw_opponent_players();
    requestAnimationFrame(game_loop);
}
