const footstepsSound = new Audio('script/sounds/footsteps.wav');
footstepsSound.loop = true;
let footstepsStart = true;

export const arshotSound = new Audio('script/sounds/arshot.wav');

export const arReloadingSound = new Audio ('script/sounds/arReloading.wav');

export const sgshotSound = new Audio('script/sounds/sgshot.wav');

export const sgReloadingSound = new Audio ('script/sounds/sgReloading.wav');

export const msshotSound = new Audio('script/sounds/msshot.wav');

export const msReloadingSound = new Audio ('script/sounds/msReloading.wav');

export const bulletHitSound = new Audio ('script/sounds/bulletHit.wav');

export const crateBreakingSound = new Audio ('script/sounds/crateBreaking.wav');

export const victorySound = new Audio ('script/sounds/victory.wav');

export const playerDeathSound = new Audio ('script/sounds/playerDeath.wav');

export const backgroundMusic = new Audio ('script/sounds/backgroundMusic.wav');
backgroundMusic.loop = true;


export const proximity_range = 750;

export function playClonedSound(audio) {
    const clone = audio.cloneNode();
    clone.play();
}

export function playSound(audio) {
    audio.play();
}

export function playFootstepsSound(dx, dy) {
    if (dx === 0 && dy === 0 && !footstepsStart) {
        footstepsSound.pause();
        footstepsStart = true;
    }
    else if ((dx !== 0 || dy !== 0) && footstepsStart) {
        footstepsSound.play();
        footstepsStart = false;
    }
} 

export function cancelReload() {
    arReloadingSound.pause();
    arReloadingSound.currentTime = 0;
    sgReloadingSound.pause();
    sgReloadingSound.currentTime = 0;
    msReloadingSound.pause();
    msReloadingSound.currentTime = 0;
}

export function reset_sounds() {
    footstepsSound.pause();
    footstepsSound.currentTime = 0;
    footstepsStart = true;
}