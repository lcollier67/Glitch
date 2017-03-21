ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    'impact.sound',
    'plugins.camera',
    'game.levels.citylights',
    'game.levels.redAlert',
    'game.levels.endLevel',
    'game.levels.title'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 300,
	lifeCount: null,
    hasJetPack: false,
    healthBar: new ig.Image( 'media/healthbar.png' ),
    lifeIcon: new ig.Image( 'media/lifeIcon.png' ),

    font: new ig.Font( 'media/neonPurpleFont.png' ),

	init: function() {
        this.lifeCount = 3;
        this.loadLevel( LevelCitylights );
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.X, 'jump' );
        ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.Z, 'chop' );
        ig.input.bind( ig.KEY.SPACE, 'fly' );
        ig.input.bind( ig.KEY.TAB, 'switch' );
        var player = this.getEntitiesByType(EntityPlayer)[0];
        ig.music.add( 'media/rollermobster.ogg' );
        this.gameOverTimerSet = false;
        this.gameOverTimer = new ig.Timer();
        ig.music.volume = 0.5;
        ig.music.play();
	},
    reloadLevel: function() {
        this.loadLevelDeferred( this.currentLevel );
    },
	
	update: function() {
        var player = this.getEntitiesByType(EntityPlayer)[0];
        if (player) {
            this.screen.x = player.pos.x - ig.system.width / 2;
            this.screen.y = (player.pos.y - ig.system.height / 2);
        }
        this.parent();
		// Update all entities and backgroundMaps

		// Add your own, additional update code here
	},

	
	draw: function() {


// Draw
		// Draw all entities and backgroundMaps
		this.parent();

        var player = this.getEntitiesByType(EntityPlayer)[0];
        //if(this.player != null) {
            if (this.lifeCount == 0) {
                this.font.draw('GAME OVER', 200, 150);
            }else {
                var x = 16,
                    y = 16;
                this.lifeIcon.draw(x, y);
                x += 42;
                this.font.draw('x ' + this.lifeCount, x, y - 5);
                x += 50;
                if (player.currentHits == 0) {
                    this.healthBar.drawTile(x, y + 6, 0, 48, 16);
                } else if (player.currentHits == 1) {
                    this.healthBar.drawTile(x, y + 6, 1, 48, 16);
                } else if (player.currentHits == 2) {
                    this.healthBar.drawTile(x, y + 6, 2, 48, 16);
                }
            }
        //}



	}
});

    MyTitle = ig.Game.extend({
        gravity: 800,


        // Load a font
        font: new ig.Font( 'media/neonPurpleFont.png' ),

        init: function() {
            // Bind keys
            ig.input.bind( ig.KEY.X, 'jump' );
            ig.input.bind( ig.KEY.C, 'shoot' );



            // We want the font's chars to slightly touch each other,
            // so set the letter spacing to -2px.
            this.font.letterSpacing = -2;

            this.loadLevel( LevelTitle );
            ig.music.add( 'media/lePerv.ogg' );
            ig.music.volume = 0.5;
            ig.music.play();
        },

        update: function() {
            var player = this.getEntitiesByType(EntityPlayer)[0];
            player.flip = true;
            // Check for buttons; start the game if pressed
            if( ig.input.pressed('jump') || ig.input.pressed('shoot') ) {
                ig.system.setGame( MyGame );
                return;
            }


            this.parent();

            // Scroll the screen down; apply some damping.
            var move = this.maxY - this.screen.y;
            if( move > 5 ) {
                this.screen.y += move * ig.system.tick;
                this.titleAlpha = this.screen.y / this.maxY;
            }
            this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;
        },

        draw: function() {
            this.parent();

            var cx = ig.system.width/2;
            this.font.draw( 'gLiTcH', 200, 150, ig.Font.ALIGN.CENTER);

            var startText = 'Press X or C to Play!';

            this.font.draw( startText, 250, 250, ig.Font.ALIGN.CENTER);
            this.font.draw( 'X To Jump', 0, 0 );
            this.font.draw( 'C To Shoot Laser(Hold and Release for Charged Laser)',0 , 32 );
            this.font.draw( 'SPACE For Jetpack When Acquired (X to Take Off)', 0, 64 );
            this.font.draw( 'Z For Melee Attack ', 0, 98);

            // Draw touch buttons, if we have any
            if( window.myTouchButtons ) {
                window.myTouchButtons.draw();
            }
        }
    });



// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyTitle, 60, 500, 400, 2);

});
