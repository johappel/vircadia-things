//
//  Created by pandora on 12/14/21
//
// This entity script handles the logic for a cow following an avatar after it was collided by him
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


(function() {


    var _this = this;
    _this.COLLISION_COOLDOWN_TIME = 5000;
    _this.GAME_LOOP_MS  = 200;
    _this.TIME_LEFT = _this.COLLISION_COOLDOWN_TIME;

    _this.cowFOLLOWS = false;
    _this.cowDOWN = false;

    /**
     *
     * @param $scene  'stand','go','fight','down'
     */
    function animate(scene){

        var startframe, endframe;

        switch (scene){

            case 'stand':
                startframe = 1;
                endframe = 680;
                break;

            case 'go':
                startframe = 715;
                endframe = 798;
                break;

            case 'fight':
                startframe = 1008;
                endframe = 1100;
                break;

            case 'down':
                startframe = 959;
                endframe = 1002;
                break;


        }
        Entities.editEntity(_this.entityID, {
            animation: {
                url: "https://cdn-1.vircadia.com/us-e-1/Developer/Tutorials/cow/cow.fbx",
                fps: 27,
                running: true,
                loop: true,
                firstFrame: startframe,
                lastFrame: endframe,
            }
        });
    }

    function playMoo(){
        if ( !_this.soundInjector || !_this.soundInjector.isPlaying()  ) {
            _this.soundInjector = Audio.playSound(_this.mooSound, _this.mooSoundOptions);
            _this.soundInjector.setOptions(_this.mooSoundOptions);
            _this.soundInjector.restart();
        }
    }

    function resetCow(){

        var quaternion = Quat.fromPitchYawRollDegrees(0, 0, 0);
        var front = Quat.getFront(quaternion);
        var lookAt = Quat.lookAtSimple(Vec3.ZERO, front);

        Entities.editEntity(_this.entityID, {
            velocity: {x: 0, y: 0, z: 0},
            angularDamping: 0.5,
            rotation: lookAt,
        });
    }

    _this.preload = function(entityID) {

        //set our id so other methods can get it.
        _this.entityID = entityID;
        //load the mooing sound
        _this.mooSound = SoundCache.getSound("http://hifi-production.s3.amazonaws.com/tutorials/cow/moo.wav")
        _this.mooSoundOptions = {
            volume: 0.7,
            loop: false
        };

        /**
         * a cow is there
         */
        playMoo();

        /**
         * Cow Standing arround
        */
        animate('stand');


        MyAvatar.collisionWithEntity.connect(function (collision) {

            console.log('collisionWithAvatar');


            var props = Entities.getEntityProperties(_this.entityID);
            _this.TIME_LEFT = _this.COLLISION_COOLDOWN_TIME;

            if(_this.cowDOWN !== true ){

                _this.cowFOLLOWS = false;

                console.log('hitpoint',Number(collision.contactPoint.y));

                if(collision.contactPoint.y >= -1.5) {
                    /**
                     * cow jumped by Avatar
                     */
                    resetCow();
                    animate('down');

                    _this.cowDOWN = true
                }else{
                    /**
                     * cow hitted by Avatar
                     */

                    /*
                    * Cow run to Avatar
                    */
                    var target = {
                        x: MyAvatar.position.x,
                        y: MyAvatar.position.y,
                        z: MyAvatar.position.z+100,
                        w: MyAvatar.position.w+100,
                    }
                    Entities.editEntity(_this.entityID, {
                        velocity: Vec3.normalize(Vec3.subtract(props.position,target)),
                        angularDamping: 1000,
                        rotation: Quat.lookAtSimple(MyAvatar.position,props.position),
                    });
                    animate('fight');
                    playMoo();
                }
            }

        });


    }


    _this.collisionWithEntity = function(myID, otherID, collisionInfo) {

        console.log('collisionWithEntity');

    };


    Script.setInterval(function () {



        if(_this.cowFOLLOWS && ! _this.cowDOWN){
            var props = Entities.getEntityProperties(_this.entityID);
            var target = MyAvatar.position;

            if (Vec3.distance (props.position,target) > 3 ) {

                Entities.editEntity(_this.entityID, {
                    velocity: Vec3.normalize(Vec3.subtract(MyAvatar.position, props.position)),
                    angularDamping: 1,
                    rotation: Quat.lookAtSimple(MyAvatar.position,props.position),
                });
                animate('go');

            }else {
                animate('stand');
            }

        }else if(_this.cowDOWN){
            resetCow();
            animate('down');
        }



        //timer
        _this.TIME_LEFT = (_this.TIME_LEFT - _this.GAME_LOOP_MS);

        /**
         * time's up
         */
        if (_this.TIME_LEFT < 0){
            _this.TIME_LEFT = _this.COLLISION_COOLDOWN_TIME;

            _this.cowFOLLOWS = true;
            _this.cowDOWN = false;

        }

    }, _this.GAME_LOOP_MS);


});
