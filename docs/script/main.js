import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';
import * as layout from './layout.js';
import * as images from './images.js';

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
    if (images.originalworldmapImg.complete) {
        layout.create_Worldmap();
        gameLoop.gameOver = false;
        gameLoop.game_Loop();
    } else {
        images.originalworldmapImg.onload = () => {
            layout.create_Worldmap();
            gameLoop.gameOver = false;
            gameLoop.game_Loop();
        };
    }
});


