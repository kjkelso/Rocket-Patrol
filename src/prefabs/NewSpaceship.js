//NewSpaceship Prefab
class NewSpaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.points = pointValue;
    }

    update() {
        //move spaceship left
        this.x -=3;
        //wrap around screen bounds
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }
    reset() {
        this.x = game.config.width;
    }
}