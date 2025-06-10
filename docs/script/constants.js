const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

canvas.width = 1250;
canvas.height = 750;

export let ctx_width = canvas.width;
export let ctx_height = canvas.height;

export let world_width = canvas.width*2;
export let world_height = canvas.height*2;

export let player = {
    world_x: 250,
    world_y: canvas.height,
    position_x: 0,
    position_y: 0,
    angle: 0,
    width: 50,
    height: 50,
    health: 100,
    speed: 5,
    weapon: 1
}