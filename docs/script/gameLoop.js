import * as weapons from './weapons.js';
import * as players from './players.js';
import * as layout from './layout.js';
import * as images from './images.js';
import * as constants from './constants.js';

export let gameOver = true;

export function create_worldmap() {
    //use to create additional stuff to map

    const offscreen = document.createElement("canvas");
    offscreen.width = world_width;
    offscreen.height = world_height;
    const offCtx = offscreen.getContext("2d");
    offCtx.drawImage(images.originalworldmapImg, 0, 0, constants.world_width, constants.world_height);
    layout.WorldMap = offscreen;
}

export function game_Loop() {
    document.getElementById("arAmmo").textContent = weapons.assault_rife.ammo;
    document.getElementById("sgAmmo").textContent = weapons.shotgun.ammo; 

    layout.background_map();
    players.move_player();
    weapons.switch_weapons();
    weapons.weapons_reload();
    if (players.player.weapon === 1) {
        weapons.fire_assault_rife();
    } else {
        weapons.fire_shotgun();
    }
    weapons.game_assault_rife();
    weapons.game_shotgun();
    players.draw_player();


    requestAnimationFrame(game_Loop);
}