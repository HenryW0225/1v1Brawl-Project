import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';

let lastServerUpdate = 0;

export function game_loop(timestamp) {
    document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; 

    layout.background_map();
    players.move_player_locally();

    if (timestamp - lastServerUpdate >= 100) {
        players.update_player_server();
        lastServerUpdate = timestamp;
    }

    players.draw_player();
    players.draw_opponent_players();
    requestAnimationFrame(game_loop);
}
