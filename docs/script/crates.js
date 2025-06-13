import * as images from './images.js';
import * as constants from './constants.js';
import { socket } from './socket.js';

let crates = [];

export function create_crates() {
    const crateCount = Math.floor(Math.random() * 6) + 5;
    const crateSize = 100;
    const maxAttempts = 1000;
    const created_crates = {};

    let attempts = 0;
    let i = 0;

    while (i < crateCount && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (constants.world_width - crateSize)); 
        const y = Math.floor(Math.random() * (constants.world_height - crateSize));

        const newCrate = { x, y, width: crateSize, height: crateSize };

        let overlaps = false;
        for (const id in created_crates) {
            const c = created_crates[id];
            if (
                x < c.x + crateSize &&
                x + crateSize > c.x &&
                y < c.y + crateSize &&
                y + crateSize > c.y
            ) {
                overlaps = true;
                break;
            }
        }
        if (!overlaps) {
            const crateId = crypto.randomUUID();
            created_crates[crateId] = newCrate;
            i++;
        }
        attempts++;
    }
}
