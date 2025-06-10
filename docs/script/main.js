import * as gameLoop from './gameLoop.js';
import * as startUI from './startUI.js';

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
    gameLoop.create_Worldmap();
    gameLoop.gameOver = false;
    gameLoop.game_Loop();
});


