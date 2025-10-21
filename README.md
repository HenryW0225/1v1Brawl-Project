## Multiplayer Top-Down Shooter Game
Inspiration

I loved playing the popular online game surviv.io with my friends and wanted to create a similar experience focused on private matches—so I could ANNIHILATE my friends faster :)

This is a real-time online multiplayer top-down shooter built with CSS, HTML5 Canvas, JavaScript, Node.js, and Socket.IO.

Live demo: henryw0225.github.io/1v1Brawl-Project/
Note: the starting request is delayed by ~1 minute.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Features

Real-time 1v1 multiplayer combat

Three unique weapons: Assault Rifle, Shotgun, Mosin Sniper

Reload and slow mechanics for each weapon

Player health system with healing and bandages

Bullet collision detection with crates and players

Audio: footstep, gunfire, reload, damage, victory, and death sounds

Breakable crates that spawn regularly and upgrade equipment (protection + extra ammo)

Lobby system with room codes for easy private matches

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Project Structure

```text
backend/           # Server-side code and multiplayer logic
  index.js         # Main entry point + socket message handling
  ...
docs/              # Frontend (client) files
  index.html       # Main HTML with canvas and game/lobby UI
  style.css        # Styles for layout, UI elements, lobby, etc.
  script/
    main.js        # Entry point; game startup + socket message handling
    ...
    sounds/        # .wav files for SFX and background music
README.md          # Setup & documentation (this file)
.gitignore         # Ignored files (node_modules/, temp files, etc.)
```   


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Usage Instructions
Creating a game

On the main screen, click Create Room to generate a unique room code.

Share this code with your friend.

Joining a game

Enter the room code your friend shared.

Click Join Room to enter the lobby.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Gameplay basics

Move: W A S D

Aim & Shoot: Mouse

Switch weapons: 1, 2, 3

Reload: R

Use bandages (heal): E

Eliminate all opponents to win the match. Then click Play Again!

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Contact

Email: hw363929@gmail.com

GitHub: HenryW0225