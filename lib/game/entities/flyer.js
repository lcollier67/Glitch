/**
 * Created by Logan on 3/15/2017.
 */
/**
 * Created by Logan on 3/15/2017.
 */
/*
 Simple Mover that visits all its targets in an ordered fashion. You can use
 the void entities (or any other) as targets.


 Keys for Weltmeister:

 speed
 Traveling speed of the mover in pixels per second.
 Default: 20

 target.1, target.2 ... target.n
 Names of the entities to visit.
 */

ig.module(
    'game.entities.flyer'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityFlyer = ig.Entity.extend({
            size: {x: 16, y: 16},
            maxVel: {x: 100, y: 100},

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            target: null,
            targets: [],
            currentTarget: 0,
            speed: 20,
            gravityFactor: 0,

            animSheet: new ig.AnimationSheet( 'media/drone.png', 16, 16 ),


            init: function( x, y, settings ) {
                this.addAnim( 'idle', 1, [0,1,2,3,4,5,6,7] );
                this.parent( x, y, settings );

                // Transform the target object into an ordered array of targets
                this.targets = ig.ksort( this.target );
            },

            check: function( other ) {
                other.receiveDamage( 3.5, this );
            },

            update: function() {
                var oldDistance = 0;
                var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
                if( target ) {
                    oldDistance = this.distanceTo(target);

                    var angle = this.angleTo( target );
                    this.vel.x = Math.cos(angle) * this.speed;
                    this.vel.y = Math.sin(angle) * this.speed;
                }
                else {
                    this.vel.x = 0;
                    this.vel.y = 0;
                }


                this.parent();

                // Are we close to the target or has the distance actually increased?
                // -> Set new target
                var newDistance = this.distanceTo(target);
                if( target && (newDistance > oldDistance || newDistance < 0.5) ) {
                    this.pos.x = target.pos.x + target.size.x/2 - this.size.x/2;
                    this.pos.y = target.pos.y + target.size.y/2 - this.size.y/2;
                    this.currentTarget++;
                    if( this.currentTarget >= this.targets.length && this.targets.length > 1 ) {
                        this.currentTarget = 0;
                    }
                }
            },
            receiveDamage: function(value){
                this.parent(value);
                if(this.health > 0)
                    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
            },
            kill: function(){
                this.parent();
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
            }
        });

    });