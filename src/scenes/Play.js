class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload() {
        //load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('newSpaceship', './assets/newSpaceship.png');
        this.load.image('parallax', './assets/parallax.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.parallax = this.add.tileSprite(0, 0, 640, 480, 'parallax').setScale(.9, .8).setOrigin(-.1, -.15);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xAAADE).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xAAADE).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xAAADE).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xAAADE).setOrigin(0, 0);
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00CF00).setOrigin(0,0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship (x3) and little one
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 25).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 25).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 25).setOrigin(0, 0);
        this.newSpaceship = new Spaceship(this, game.config.width, 200, 'newSpaceship', 0, 50).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;


        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FACADE',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 500
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //clock display
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FACADE',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth:200
        }
        this.timerGoing = game.settings.gameTimer/1000;
        console.log(this.timerGoing);
        this.timeLeft = this.add.text(69, 54, this.timerGoing, timeConfig);

        for (let i = 1000; i < game.settings.gameTimer + 1000; i+=1000) { 
            this.clock = this.time.delayedCall(i, () => {
                this.timerGoing -= 1;
            }, null, this);
        }

        //speed up at 30s
        this.clock = this.time.delayedCall(30000, () => {
            console.log(game.settings.spaceshipSpeed);
            game.settings.spaceshipSpeed += 2;
            console.log(game.settings.spaceshipSpeed);
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll starfield
        this.parallax.tilePositionX -= 3.5;
        this.starfield.tilePositionX -= 2;
        this.newSpaceship.x -= 3;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.newSpaceship.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.newSpaceship)) {
            this.p1Rocket.reset();
            this.shipExplode(this.newSpaceship);
        }

        this.timeLeft.text = this.timerGoing;
        
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });    
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;  
        this.sound.play('sfx_explosion');        
    }

    /*countdownClock(timeLeft) {
        if (this.timeLeft > 0) {
            this.timeLeft = (game.settings.gameTimer/1000) - 1;
        }
    } */
}