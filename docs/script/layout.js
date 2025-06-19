import * as constants from './constants.js';
import * as images from './images.js';

let WorldMap;

export function create_worldmap() {
    const offscreen = document.createElement("canvas");
    offscreen.width = constants.world_width;
    offscreen.height = constants.world_height;
    const offctx = offscreen.getContext("2d");
    offctx.drawImage(images.originalworldmapImg, 0, 0, constants.world_width, constants.world_height);

    WorldMap = offscreen;
}

export function background_map(screen) {
    constants.ctx.clearRect(0, 0, constants.ctx_width, constants.ctx_height);
    constants.ctx.drawImage(WorldMap, screen.camera_x, screen.camera_y, constants.ctx_width, constants.ctx_height, 0, 0, constants.ctx_width, constants.ctx_height);
}

export function draw_victory_sign() {
    constants.ctx.drawImage(images.victoryImg, constants.ctx_width/2 - 100, constants.ctx_height/2 - 50, 200, 100);
}

export function draw_defeat_sign() {
    constants.ctx.drawImage(images.defeatImg, constants.ctx_width/2 - 100, constants.ctx_height/2 - 50, 200, 100);
}
