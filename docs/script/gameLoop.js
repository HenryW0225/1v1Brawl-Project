import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';

export function game_loop() {
    document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; 

    layout.background_map();
    players.move_player_locally();
    players.update_player_server();
    players.draw_players();

    requestAnimationFrame(game_loop);
}