import { nanoid } from 'nanoid';

const rooms = {};

export function createRoom(socketId) {
    const roomCode = nanoid(5).toUpperCase();
    rooms[roomCode] = [socketId];
    return roomCode;
}

export function joinRoom(roomCode, socketId) {
    if (rooms[roomCode] && rooms[roomCode].length < 2) {
        rooms[roomCode].push(socketId);
        return true;
    }
    return false;
}

export function getRoom(socketId) {
    for (const code in rooms) {
        if (rooms[code].includes(socketId)) return code;
    }
    return null;
}

export function leaveRoom(socketId) {
    for (const code in rooms) {
        const index = rooms[code].indexOf(socketId);
        if (index !== -1) {
            rooms[code].splice(index, 1);
            if (rooms[code].length === 0) {
                delete rooms[code];
            }
            return code;
        }
    }
    return null;
}
