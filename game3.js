// https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/
(function() {
    const width = 800,
        height = 600;


    let player = null,
        map = null,
        platforms = null,
        cursors = null,
        jumpButton = null,
        groundLayer = null,
        coinLayer = null,
        score = 0,
        text = null;

    let collectCoin = function(sprite, tile) {
        coinLayer.removeTileAt(tile.x, tile.y);
        score++;
        text.setText(score);
        return false;
    }


    // Laoding game resources, Phaser 3 comes with nice loading functionality
    let _preload = function() {
        // Map made with Tiled in JSON format - 009
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        // Tiles in spritesheet 
        this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 70, frameHeight: 70 });
        // simple coin image
        this.load.image('coin', 'assets/coinGold.png');
        // Player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');

        //this.load.crossOrigin = 'anonymous';
    };

    let _create = function() {
        // Loading the map
        map = this.make.tilemap({ key: 'map' });

        // Tiles for the ground layer
        var groundTiles = map.addTilesetImage('tiles');
        // Greate the ground layer
        groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
        // The player will collide with this layer
        groundLayer.setCollisionByExclusion([-1]);

        // Set the boundaries of our game world
        // We will need the last two rows to limit the movement of our player and the camera later on. 
        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;

        // Create the player sprite    
        player = this.physics.add.sprite(50, 300, 'player');
        player.setBounce(0); // Our player will bounce from items
        player.setCollideWorldBounds(true); // Don't go out of the map

        this.physics.add.collider(groundLayer, player);

        cursors = this.input.keyboard.createCursorKeys();

        // Moving the camera along with the player | startFollow
        // Set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // Make the camera follow the player
        this.cameras.main.startFollow(player);
        // Set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff');

        // Adding walking animation to the player
        this.anims.create({
            key: 'walk', // key is the name of the animation
            // Adding walk frames
            frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
            frameRate: 20,
            repeat: -1 // -1 = loop this animation
        });

        // Idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'p1_stand' }],
            frameRate: 10,
        });

        // Adding coins to the map
        var coinsImage = map.addTilesetImage('coin');
        // Addign coins as tiles
        coinLayer = map.createDynamicLayer('Coins', coinsImage, 0, 0);
        // The coin id is 17, when the player overlaps with a tile with index 17, collectCoin will be called
        // The function setTileIndexCallback can be used to invoke certain actions when the player touches some tiles.
        coinLayer.setTileIndexCallback(17, collectCoin, this);
        this.physics.add.overlap(player, coinLayer);


        //
        text = this.add.text(20, 570, '0', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        text.setScrollFactor(0);
    };


    let _update = function() {
        if (cursors.left.isDown) {
            player.body.setVelocityX(-200); // Moving left
            player.anims.play('walk', true); // Playing the walk animation
            player.flipX = true; // flip the sprite to the left

        } else if (cursors.right.isDown) {
            player.body.setVelocityX(200); // Move right
            player.anims.play('walk', true);
            player.flipX = false;
        } else if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) {
            player.body.setVelocityY(-500); // Jump up            
        } else {
            player.body.setVelocityX(0);
            player.anims.play('idle', true);
        }

        // this.physics.arcade.collide(player, platforms);
        // player.body.velocity.x = 0;

        // if (cursors.left.isDown)
        //     player.body.velocity.x = -250;
        // else if (cursors.right.isDown)
        //     player.body.velocity.x = 250;

        // if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
        //     player.body.velocity.y = -400;
        // }
    }


    new Phaser.Game({
        type: Phaser.AUTO, // The type of renderer you want to use // Phaser.WEBGL | Phaser.CANWAS, AUTO will try to use webGl, canvas
        width: width,
        height: height,
        physics: {
            default: 'arcade', // Usign Phaser 3 arcade style
            arcade: {
                gravity: {
                    y: 500, // will affect our player sprite
                    debug: true // Only for debugging
                }
            }
        },
        scene: {
            key: 'main',
            preload: _preload, // Loading the game assets
            create: _create, // Create the map,players and other stuff
            update: _update // Runs the game loop, updates the game state
        }
    });

}());