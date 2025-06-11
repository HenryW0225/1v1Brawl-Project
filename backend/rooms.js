import { nanoid } from 'nanoid';

export const rooms = {};

export function createRoom(socketId, username) {
    const roomCode = nanoid(5).toUpperCase();
    rooms[roomCode] = [{ id: socketId, name: username }];
    return roomCode;
}

export function joinRoom(roomCode, socketId, username) {
    if (rooms[roomCode] && rooms[roomCode].length < 2) {
        rooms[roomCode].push({ id: socketId, name: username });
        return true;
    }
    return false;
}

export function getRoom(socketId) {
    for (const code in rooms) {
        if (rooms[code].some(player => player.id === socketId)) return code;
    }
    return null;
}

export function leaveRoom(socketId) {
    for (const code in rooms) {
        const index = rooms[code].findIndex(player => player.id === socketId);
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
