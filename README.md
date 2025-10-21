Multiplayer Top-Down Shooter Game
Inspiration:
I loved playing the popular online game survev.io with my friends and wanted to create a similar experience focused on private matches so I could ANNIHILATE my friends faster :)
This is a real-time online multiplayer top-down shooter game built using CSS, HTML5 Canvas, JavaScript, Node.js, and Socket.IO.
Try the game out yourself at henryw0225.github.io/1v1Brawl-Project/ - Starting request is delayed by 1 minute

Features
Real-time 1v1 multiplayer combat


Three unique weapons: Assault Rifle, Shotgun, and Mosin Sniper


Reload and slow mechanics for each weapon


Player health system with healing and bandages


Bullet collision detection with crates and players


Footstep, gunfire, reload, damage, victory, and death sounds


Breakable crates that spawn regularly and upgrade player’s equipments which offers protection and additional ammo


Lobby system with room codes for easy private matches



Project Structure
backend/
Server-side code and multiplayer logic.
node_modules/ — Installed dependencies


package.json — Project metadata and required packages


package-lock.json — Locked versions of installed packages


index.js — Main server entry point that initializes the server and sets up Socket.IO


rooms.js — Functions for creating and managing game rooms


games.js — Handles server-side game logic, game states, player movement, health, collisions, etc.



docs/ (Frontend)
Client-side files for rendering, input handling, audio, and UI.
index.html — Main HTML structure including canvas and game/lobby UI


style.css — CSS styles for game layout, UI elements, lobby, etc.


📂 docs/script/
Organized frontend logic and game modules.
main.js — Entry point for frontend logic; handles game startup and socket messages


gameLoop.js — Runs the main game loop


input.js — Handles user input (keyboard/mouse)


socket.js — Defines the socket


session.js — Stores and syncs session data like room codes, player state, etc.


startUI.js — UI logic for room creation/joining and start screen interactions


layout.js — Handles background rendering and map layout on the canvas


images.js — Contains images used to draw the different parts of the game


constants.js — Centralized file for necessary constants like the canvas width


crates.js — Manages crate spawning, collisions, and rendering


equipment.js — Defines equipment stats; handles equipment upgrades and rendering


players.js — Handles player movement; functions to draw players and opponent players; updates server and uses interpolation to render all players smoothly


weapons.js — Defines weapon stats, reload mechanics, and shooting behavior, handle bullets and collision detection


sounds.js — Import files and handle sound effects and background music


docs/script/sounds/
(various .wav files) — Audio files for sound effects and background music



Other Files
README.md — This file, with setup instructions and game documentation


.gitignore — Specifies files/folders Git should ignore (e.g. node_modules/, temp files)

Future Ideas
Implement a shrinking zone mechanic that forces players closer together over time


Add more weapon types and equipment


Introduce better equipment upgrade and item pickup mechanics

Usage Instructions
Creating a game:
 On the main screen, click Create Room to generate a unique room code. Share this code with your friend.


Joining a game:
 Enter the room code your friend shared and click Join Room to enter the lobby.


Gameplay basics:


Move your player using WASD.


Aim and shoot using the mouse.


Switch weapons using number keys (1, 2, 3).


Reload weapons with the R key.


Use bandages to heal when injured (press E).


Winning:
Eliminate all opponents to win the match. Then Play Again!

Contact
Email: hw363929@gmail.com
GitHub: HenryW0225
