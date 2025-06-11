import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';

let frame = 0;

export function game_loop() {
    document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; 


    layout.background_map();
    if (frame%6 === 0) {
        players.move_player();
    }
    /*if (constants.player.weapon === 1) {
        weapons.fire_assault_rife();
    } else {
        weapons.fire_shotgun();
    }
    weapons.game_assault_rife();
    weapons.game_shotgun();*/
    players.draw_players();
    frame++;

    requestAnimationFrame(game_loop);
}