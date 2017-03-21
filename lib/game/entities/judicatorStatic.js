/**
 * Created by Logan on 3/16/2017.
 */
ig.module(
    'game.entities.judicatorStatic'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityJudicatorStatic = ig.Entity.extend({
            animSheet: new ig.AnimationSheet( 'media/judicator.png', 32, 32 ),
            size: {x: 26, y:30},
            offset: {x: 4, y: 0},
            maxVel: {x: 100, y: 100},
            flip: true,
            friction: {x: 150, y: 0},
            speed: 14,
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.addAnim('idle', 1, [0,1,2,3]);
            },
            update: function() {
                this.parent();
            },
            check: function( other ) {
                other.kill();
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