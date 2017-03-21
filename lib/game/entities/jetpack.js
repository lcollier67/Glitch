/**
 * Created by Logan on 3/15/2017.
 */
ig.module(
    'game.entities.jetpack'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityJetpack = ig.Entity.extend({
            animSheet: new ig.AnimationSheet( 'media/jetpack.png', 16, 16 ),
            size: {x: 16, y:16},
            offset: {x: 4, y: 0},
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                //this.addAnim('idle', .07, [0,1,2,3]);
                this.addAnim('walk', .5, [0,1]);
            },
            update: function() {
                this.parent();
            },

            check: function( other ) {
                other.giveJetPack();
                this.kill();
            },

            kill: function(){
                this.parent();
            }
        });
    });