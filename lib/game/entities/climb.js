/**
 * Created by Logan on 3/15/2017.
 */
ig.module(
    'game.entities.climb'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){

        EntityClimb   = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
            _wmScalable:true,
            size: {x: 8, y: 8},
            target: null,
            wait:-1,
            waitTimer: null,
            canFire: true,
            checkAgainst: ig.Entity.TYPE.BOTH,
            init: function( x, y, settings ) {
                if( settings.checks ) {
                    this.checkAgainst = ig.Entity.TYPE[settings.checks.toUpperCase()] || ig.Entity.TYPE.BOTH;
                    delete settings.check;
                }

                this.parent( x, y, settings );
                this.waitTimer = new ig.Timer();
            },
            check: function( other ) {

                if(other instanceof EntityPlayer) {
                    if(other.isFlying){
                        return;
                    }else {
                        if(!other.isStanding) {
                            other.accel.x = 0;
                        }
                        other.gravityFactor = 0;
                        other.accel.y = 0;
                        other.isClimbing = true;
                    }
                }

                //alert("touch Kill");
            },


            update: function(){
            }
        });

    });