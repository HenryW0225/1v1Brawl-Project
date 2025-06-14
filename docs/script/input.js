const canvas = document.getElementById("gameCanvas");

export let mouseX = 0;
export let mouseY = 0;
export const keys = {};

export let firing = {
    mouseDown: false,
    canFire: true
}

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

window.addEventListener("keydown", function(event) {
    keys[event.code] = true;
});

window.addEventListener("keyup", function(event) {
    keys[event.code] = false;
});

window.addEventListener("mousedown", () => {
    firing.mouseDown = true;
});

window.addEventListener("mouseup", () => {
    firing.mouseDown = false;
    firing.canFire = true;
});

export function reset() {
    firing.mouseDown = false;
    firing.canFire = true;
    for (let k in keys) delete keys[k];
}
