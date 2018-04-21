// https://gamedevacademy.org/phaser-3-tutorial/
(function() {
    // Think of the scene as game compartment where the game actions take place
    // In Phaser 3 there can be multiple
    // Scene lifecycle - init-preload-create-upload-render-destroy-shutdown
    // init - setup params for the game
    // create - one time execution , create player, enemies

    let scene = new Phaser.Scene('Game');

    const width = 640,
        height = 360;

    let = config = {
        type: Phaser.AUTO,
        width,
        height,
        scene: scene // Newly created scene
    };

    let game = new Phaser.Game(config);
    let player = null;

    scene.gameOver = function(won) {
        this.cameras.main.shake(50);
        this.time.delayedCall(250, function() {
            this.cameras.main.fade(200);
            this.cameras.main.resetFX();
        }, [], this);

        // this.time.delayedCall(300, function() {
        //     this.scene.sleep();
        //     this.time.delayedCall(100, function() {
        //         this.scene.start();
        //     }, [], this);
        // }, [], this);
    }

    scene.init = function() {
        this.player = null;
        this.playerSpeed = 4;
        this.cursors = null;
        this.enemyMaxY = 280;
        this.enemyMinY = 80;
        this.treasure = null;
        this.enemiese = null;
        this.cursors = null;
    };

    scene.preload = function() {
        this.load.image( /*Label to the asset*/ 'background', 'crossy-rpg/assets/background.png');
        this.load.image('player', 'crossy-rpg/assets/player.png');
        this.load.image('dragon', 'crossy-rpg/assets/dragon.png');
        this.load.image('treasure', 'crossy-rpg/assets/treasure.png');
    };

    scene.create = function() {
        // creating a new spite on the scene object
        // Sprites by default have their origin point (anchor point) in the center
        let bgSprite = this.add.sprite(0 /*x*/ , 0 /*y*/ , 'background');
        bgSprite.setOrigin(0, 0);

        // Player
        this.player = this.add.sprite(5, this.sys.game.config.height / 2, "player");
        // Scalling down
        this.player.setScale(1 / 2); //  this.scaleX, this.scaleY

        // Treasure
        this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
        this.treasure.setScale(.6);

        // Ememinies
        this.enemiese = this.add.group({
            key: 'dragon',
            repeat: 5, // making five dragons            
            setXY: {
                x: 80,
                y: this.enemyMinY,
                stepX: 90,
                stepY: 30
            }
        });
        // Member of a group are called children
        //this.enemiese.setScale(.5);
        Phaser.Actions.ScaleXY(this.enemiese.getChildren(), -0.5, -0.5);
        // Phaser.Actions.Call allows us to call a method on each array element.
        let children = this.enemiese.getChildren();
        Phaser.Actions.Call(children, function(enemy) {
            enemy.speed = Math.random() * 1 + 1;
        }, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    };


    scene.update = function() {
        // this.input - Gives access to the input object of the scene
        // if (this.input.activePointer.isDown /* A touch on viewport and left click button*/ ) {
        //     this.player.x += this.playerSpeed;
        // }
        if (this.cursors.right.isDown) {
            this.player.x += this.playerSpeed;
            this.player.flipX = false;
        } else if (this.cursors.left.isDown) {
            this.player.x -= this.playerSpeed;
            this.player.flipX = true;
        }
        // Treasure collision
        // getBounds gives us rect coordinates
        // Phaser.Geom.Intersects.RectangleToRectangle - returns true if bounds overlap
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
            this.gameOver();
        }

        // Moving enemies
        let enemies = this.enemiese.getChildren();

        for (let i = 0; i < enemies.length; i++) {
            // // Reverse movement if reached the eadge
            if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
                enemies[i].speed *= -1;
            } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
                enemies[i].speed *= -1;
            } {
                // Moving enemies
                enemies[i].y += enemies[i].speed;
            }

            // Enemy collision detection
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemies[i].getBounds(), this.player.getBounds())) {
                this.gameOver();
                break;
            }
        }
    }

}());