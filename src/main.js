/*
Katarina Kelso Point Breakdown

Starting Tier
Implement the speed increase that happens after 30 seconds in the original game (10)
Allow the player to control the Rocket after it's fired (10)

Novice Tier
Display the time remaining (in seconds) on the screen (15)
Implement parallax scrolling (15)

Intermediate Tier
Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (25)
Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (25) */

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
};

let game = new Phaser.Game(config);

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    newSpaceshipSpeed: 8,
    gameTimer: 60000    
}