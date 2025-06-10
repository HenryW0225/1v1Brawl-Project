import * as constants from './constants.js';

export let WorldMap;

export function background_map() {
    constants.ctx.clearRect(0, 0, constants.ctx_width, constants.ctx_height);
    constants.position_x = Math.max(Math.min(constants.player.world_x, constants.world_width - constants.ctx_width/2), constants.ctx_width/2);
    constants.position_y = Math.max(Math.min(constants.player.world_y, constants.world_height - constants.ctx_height/2), constants.ctx_height/2);
    constants.ctx.drawImage(WorldMap, constants.position_x - constants.ctx_width/2, constants.position_y - constants.ctx_height/2, constants.ctx_width, constants.ctx_height, 0, 0, constants.ctx_width, constants.ctx_height);
}

