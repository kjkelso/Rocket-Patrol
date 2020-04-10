class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }

    create() {
        console.log(this);
        this.add.text(20, 20, "Rocket Patrol Menu");

        // launch the enxt scene
        this.scene.start("playScene");
    }
}