/**
 * Created by Logan on 3/15/2017.
 */
ig.module(
    'game.entities.onLand'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityOnLand   = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(0, 255, 0, 0.7)',
            _wmScalable:true,
            size: {x: 8, y: 8},
            checkAgainst: ig.Entity.TYPE.BOTH,
            check: function( other ) {
                if(other instanceof EntityPlayer) {
                    if(other.isFlying){
                        return;
                    }else {
                        if(other.isSwimming){
                            other.accel.y = 0;
                        }
                        other.isSwimming = false;
                        other.isClimbing = false;
                        other.gravityFactor = 1;
                    }
                }
            },

            update: function(){}
        });

    });