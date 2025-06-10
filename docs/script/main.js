import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';
import * as constants from './constants.js';

startUI.createBtn.addEventListener("click", () => {
    startUI.create_button();
});

startUI.joinBtn.addEventListener("click", () => {
    startUI.join_button();
});

startUI.enterBtn.addEventListener("click", () => {
    startUI.enter_button();
});

startUI.startBtn.addEventListener("click", () => {
    startUI.start_button();
    gameLoop.gameOver = false;
    gameLoop.game_Loop();
});

images.originalworldmapImg.onload = () => {
    const offscreen = document.createElement("canvas");
    offscreen.width = constants.world_width;
    offscreen.height = constants.world_height;
    const offctx = offscreen.getContext("2d");
    offctx.drawImage(images.originalworldmapImg, 0, 0, constants.world_width, constants.world_height);

    layout.WorldMap = offscreen;
};

