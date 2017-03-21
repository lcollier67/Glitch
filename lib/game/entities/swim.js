/**
 * Created by Logan on 3/15/2017.
 */
ig.module(
    'game.entities.swim'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntitySwim   = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
            _wmScalable:true,
            size: {x: 8, y: 8},
            checkAgainst: ig.Entity.TYPE.BOTH,
            check: function( other ) {
                if(other instanceof EntityPlayer) {
                    //other.vel.y -= 10;
                    if(other.isFlying){
                        return;
                    }else {
                        other.isSwimming = true;
                    }
                }
                //alert("touch Kill");
            },

            update: function(){}
        });

    });