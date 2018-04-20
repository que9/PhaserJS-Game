//(function() {
const width = 500,
    height = 400;


let player = null,
    platforms = null,
    cursors = null,
    jumpButton = null;

// Laoding game resources
let _preload = function() {
    //this.stage.backgroundColor = '#85b5e1';
    this.load.baseURL = 'http://examples.phaser.io/assets/';
    // CORS - 009
    this.load.crossOrigin = 'anonymous';

    this.load.image('player', 'sprites/phaser-dude.png');
    this.load.image('platform', 'sprites/platform.png');
};

let _create = function() {
    // Adding the player on to the map
    player = this.add.sprite(100, 200, 'player');
    // this.physics.arcade.enable(player);
    this.physics.world.enable(player);

    // debugger;
    // this.physics.arcade.enable(player);

    // Forcing the player to flow a straith line
    player.body.collideWorldBounds = true;
    player.gravity.y = 500;

    platforms = this.add.physicsGroup();
    platforms.create(500, 150, 'platform');
    platforms.create(-200, 300, 'platform');
    platforms.create(400, 450, 'platform');

    platforms.setAll('body.immovable', true);

    cursors = this.input.keyboard.createCursorKeys();
    jumpButton.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};


let _update = function() {
    this.physics.arcade.collide(player, platforms);
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
        player.body.velocity.x = -250;
    else if (cursors.right.isDown)
        player.body.velocity.x = 250;

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
        player.body.velocity.y = -400;
    }
}


new Phaser.Game({
    type: Phaser.AUTO,
    width: width,
    height: _h,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    scene: {
        preload: _preload,
        create: _create,
        update: _update
    }
});
//}());