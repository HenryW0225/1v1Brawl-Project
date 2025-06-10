import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';
import * as constants from './constants.js';

let gameOver = true;

export function reset_game() {
    gameOver = false;
}

export function game_loop() {
    /*document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; */
    if (gameOver) {
        return;
    }
    layout.background_map();
    /*players.move_player();
    weapons.switch_weapons();
    weapons.weapons_reload();
    if (constants.player.weapon === 1) {
        weapons.fire_assault_rife();
    } else {
        weapons.fire_shotgun();
    }
    weapons.game_assault_rife();
    weapons.game_shotgun();
    players.draw_player();*/


    requestAnimationFrame(game_loop);
}