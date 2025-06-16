const footstepsSound = new Audio('sounds/footsteps.wav');
footstepsSound.loop = true;
let footstepsStart = true;

export const arshotSound = new Audio('sounds/arshot.wav');

export const arReloadingSound = new Audio ('sounds/arReloading.wav');

export const sgshotSound = new Audio('sounds/sgshot.wav');

export const sgReloadingSound = new Audio ('sounds/sgReloading.wav');

export const msshotSound = new Audio('sounds/msshot.wav');

export const msReloadingSound = new Audio ('sounds/msReloading.wav');

export const bulletHitSound = new Audio ('sounds/bulletHit.wav');

export const crateBreakingSound = new Audio ('sounds/crateBreaking.wav');

export const victorySound = new Audio ('sounds/victory.wav');

export const playerDeathSound = new Audio ('sounds/playerDeath.wav');

export const backgroundMusic = new Audio ('sounds/backgroundMusic.wav');



export function playClonedSound(audio) {
    const clone = audio.cloneNode();
    clone.play();
}

export function playSound(audio) {
    audio.currentTime = 0;
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
    sgReloadingSound.pause();
    msReloadingSound.pause();
}

export function reset_sounds() {
    footstepsSound.pause();
    footstepsSound.currentTime = 0;
    footstepsStart = true;

    arshotSound.pause();
    arshotSound.currentTime = 0;

    sgshotSound.pause();
    sgshotSound.currentTime = 0;

    msshotSound.pause();
    msshotSound.currentTime = 0;
}