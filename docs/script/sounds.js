const footstepsSound = new Audio('sounds/footsteps.wav');
footstepsSound.loop = true;
let footstepsStart = true;

const arshotSound = new Audio('sounds/arshot.wav');
//mosin shot
//shotgun shot
//player hit/crate hit
//crate breaking
//player death
//background music (start menu and such);




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



export function reset_sounds() {
    footstepsSound.pause();
    footstepsStart = true;
}