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

export function background_map() {
    constants.ctx.clearRect(0, 0, constants.ctx_width, constants.ctx_height);
    const position_x = Math.max(Math.min(session.player.world_x, constants.world_width - constants.ctx_width/2), constants.ctx_width/2);
    const position_y = Math.max(Math.min(session.player.world_y, constants.world_height - constants.ctx_height/2), constants.ctx_height/2);
    constants.ctx.drawImage(WorldMap, position_x - constants.ctx_width/2, position_y - constants.ctx_height/2, constants.ctx_width, constants.ctx_height, 0, 0, constants.ctx_width, constants.ctx_height);
}

export function draw_victory_sign() {
    constants.ctx.drawImage(images.victoryImg, constants.ctx_width/2 - 200, constants.ctx_height/2 - 100, 400, 200);
}

export function draw_defeat_sign() {
    constants.ctx.drawImage(images.defeatImg, constants.ctx_width/2 - 200, constants.ctx_height/2 - 100, 400, 200);
}
