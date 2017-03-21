/**
 * Created by Logan on 3/16/2017.
 */
/**
 * Created by Logan on 3/16/2017.
 */
ig.module(
    'game.entities.npc'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityNpc = ig.Entity.extend({
            animSheet: new ig.AnimationSheet( 'media/selfNPC.png', 32, 32 ),
            size: {x: 32, y:32},
            offset: {x: 0, y: 0},
            maxVel: {x: 100, y: 100},
            flip: true,
            friction: {x: 150, y: 0},
            speed: 14,
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.addAnim('idle', 1, [0,1,2,3,4]);
            },
            update: function() {
                this.parent();
            },
        });
    });