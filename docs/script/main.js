import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';

startUI.createBtn.addEventListener("click", () => {
    startUI.create_button();
});

joinBtn.addEventListener("click", () => {
    startUI.join_button();
});

enterBtn.addEventListener("click", () => {
    startUI.enter_button();
});

startBtn.addEventListener("click", () => {
    startUI.start_button();
    gameLoop.gameOver = false;
    gameLoop.create_worldmap();
    gameLoop.game_Loop();

});

