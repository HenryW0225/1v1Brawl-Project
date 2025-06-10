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
    constants.player.position_x = Math.max(Math.min(constants.player.world_x, constants.world_width - constants.ctx_width/2), constants.ctx_width/2);
    constants.player.position_y = Math.max(Math.min(constants.player.world_y, constants.world_height - constants.ctx_height/2), constants.ctx_height/2);
    constants.ctx.drawImage(WorldMap, constants.player.position_x - constants.ctx_width/2, constants.player.position_y - constants.ctx_height/2, constants.ctx_width, constants.ctx_height, 0, 0, constants.ctx_width, constants.ctx_height);
}

