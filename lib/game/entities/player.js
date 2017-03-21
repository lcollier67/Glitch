ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/smallGlitch.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 0},
        flip: false,
        maxVel: {x: 100, y: 180},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 300,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        weapon: 0,
        totalWeapons: 2,
        activeWeapon: "EntityLaser",
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        chargeTimer: null,
        hasJetpack: false,
        isSwimming: false,
        isFlying: false,
        isClimbing: false,
        currentHits:0,
        gravityFactor: 1,
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	if(settings.hasJetpack){
        	    this.giveJetPack();
            }
            this.setupAnimation(this.weapon);
            this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.chargeTimer = new ig.Timer();
            this.makeInvincible();

        },
        setupAnimation: function(offset){
            offset = offset * 10;
            this.addAnim('idle', .4, [0+offset, 1+offset,2+offset,3+offset, 4+offset]);
            this.addAnim('run', .07, [5+offset, 6+offset, 7+offset,8+offset,9+offset,10+offset]);
            this.addAnim('jump', 1, [11+offset]);
            this.addAnim('fall', 1, [12+offset]);
            this.addAnim('swim', .4, [13+offset, 14+offset,15+offset,16+offset, 17+offset]);
            this.addAnim('climb', .4, [18+offset, 19+offset,20+offset]);
            this.addAnim('fly', .4, [21+offset, 22+offset,23+offset,24+offset,25+offset]);

        },
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        update: function() {
              // move left or right
        	var accel = this.standing ? this.accelGround : this.accelAir;
        	if( ig.input.state('left') ) {
                if(this.isFlying){
                    this.vel.y = 0;
                }
        		this.accel.x = -accel;
        		this.flip = true;
        	}else if( ig.input.state('right') ) {
        	    if(this.isFlying){
        	        this.vel.y = 0;
                }
        		this.accel.x = accel;
        		this.flip = false;
        	}else if(ig.input.state('down')){
                if(this.isFlying){
                    this.vel.x = 0;
                }
        	    if(this.isSwimming) {
                    this.accel.y = -200;
                }else if(this.isClimbing){
                    this.accel.y = 40;
                }else if(this.isFlying){
                    this.accel.y = 100 ;
                }
            }else if(ig.input.state('up')){
                if(this.isFlying){
                    this.vel.x = 0;
                }
                if(this.isSwimming) {
                    this.accel.y = -400;
                }else if(this.isClimbing){
                    this.accel.y = -40;
                }else if(this.isFlying){
                    this.accel.y = -100;
                }
            }else{
        		this.accel.x = 0;
        	}
        	// jump
        	if( ig.input.pressed('jump') ) {
                if(this.isFlying){
                    this.isFlying = false;
                    this.gravityFactor = 1;
                    this.accel.y = 0;
                }
                if(this.standing) {
                    this.vel.y = -this.jump;
                }
        	}
            if( ig.game.hasJetpack && ig.input.pressed('fly') ) {

                    this.gravityFactor = 0;
                    this.isFlying = true;
            }

            // shoot
            if( ig.input.pressed('shoot') ) {
            	ig.game.spawnEntity( EntityLaser, this.pos.x , this.pos.y - 8 , {flip:this.flip} );
            	this.chargeTimer.set(1);
            }
            if( ig.input.released('shoot') && this.chargeTimer.delta() > 0){

                ig.game.spawnEntity( EntityBigLaser, this.pos.x , this.pos.y - 10, {flip:this.flip} );
            }
            if( ig.input.pressed('chop') ) {
                ig.game.spawnEntity( EntityChop, this.pos.x , this.pos.y , {flip:this.flip} );
                this.chargeTimer.set(1);
            }
            // set the current animation, based on the player's speed
            if( this.isSwimming ) {
                this.currentAnim = this.anims.swim;
            }else if( this.isClimbing ) {
                this.currentAnim = this.anims.climb;
            }else if( this.isFlying ) {
                this.currentAnim = this.anims.fly;
            }else {
                if (this.vel.y < 0) {
                    this.currentAnim = this.anims.jump;
                } else if (this.vel.y > 0) {
                    this.currentAnim = this.anims.fall;
                } else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.run;
                } else {
                    this.currentAnim = this.anims.idle;
                }
            }
            this.currentAnim.flip.x = this.flip;
            if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
        	// move!
        	this.parent();
        },
        kill: function(){
            ig.game.lifeCount -= 1;
        	this.parent();
        	var x = this.startPosition.x;
        	var y = this.startPosition.y;
        	if(ig.game.lifeCount != 0){
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                    callBack: function () {
                        ig.game.spawnEntity(EntityPlayer, x, y)
                    }
                });
            }else {

            }
        }
        ,
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.currentHits += 1;
            this.parent(amount, from);
            this.makeInvincible();
        },
        draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            this.parent();
        },

        giveJetPack:function(){
            ig.game.hasJetpack = true;
        },
        turnoffGravity:function(){
            this.gravityFactor = true;
        },
        turnOnGravity:function(){
            this.gravityFactor = true;
        }


    });

    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/sparks.png', 2, 2 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

    EntityLaser = ig.Entity.extend({
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/laser.png', 5, 3 ),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        flip: false,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = this.accel.y;
            this.flip = settings.flip;
            this.addAnim( 'idle', 0.2, [0,1] );
        },
        handleMovementTrace: function( res ) {
            this.currentAnim.flip.x = this.flip;
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.receiveDamage( 2, this );
            this.kill();
        }
    });
    EntityChop = ig.Entity.extend({
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/chop.png', 16, 16 ),
        maxVel: {x: 200, y: 0},
        lifetime: .05,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        flip: false,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -16 : 8) , y, settings );
            this.flip = settings.flip;
            this.addAnim( 'idle', 0.2, [0,1] );
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            this.currentAnim.flip.x = this.flip;
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        },

        check: function( other ) {
            other.receiveDamage( 4, this );
        }
    });
    EntityBigLaser = ig.Entity.extend({
        size: {x: 10, y: 10},
        animSheet: new ig.AnimationSheet( 'media/bigLaser.png', 10, 10 ),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.flip = settings.flip;
            this.addAnim( 'idle', 0.2, [0,1,2] );
        },
        handleMovementTrace: function( res ) {
            this.currentAnim.flip.x = this.flip;
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.kill();
        }
    });


});
