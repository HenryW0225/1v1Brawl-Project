const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

canvas.width = 1250;
canvas.height = 750;

export let ctx_width = canvas.width;
export let ctx_height = canvas.height;

export let world_width = canvas.width*2;
export let world_height = canvas.height*2;

