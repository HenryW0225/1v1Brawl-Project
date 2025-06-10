export let mouseX = 0;
export let mouseY = 0;
export const keys = {};
export let mouseDown = false;
export let canFire = true;

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
    mouseDown = true;
});

window.addEventListener("mouseup", () => {
    mouseDown = false;
    canFire = true;
});
