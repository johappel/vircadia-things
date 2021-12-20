(function() {


    var _this = this;
    _this.y = 0;
    _this.x = 0;
    _this.goforward = [0,0,0];
    _this.steplength = 3;


    _this.preload = function(entityID) {

        //set our id so other methods can get it.
        _this.entityID = entityID;


    }



    Entities.enterEntity.connect(function (entityID ){

        var props = Entities.getEntityProperties(_this.entityID);

        var steps = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 0, z: -1 }));

        MyAvatar.goToLocation(steps,false,null,false,true);
        //MyAvatar.goToFeetLocation(_this.goforward);

    });

    Script.setInterval(function () {

        _this.vx = (MyAvatar.position.x - _this.x)>0 ? MyAvatar.position.x - _this.x : _this.x-MyAvatar.position.x;
        _this.vz = (MyAvatar.position.z - _this.z)>0 ? MyAvatar.position.z - _this.z : _this.z-MyAvatar.position.z;

        var dir = (_this.vz > _this.vx)? 'blue':'red';
        var xstep,zstep;


        if(dir == "blue"){

            zstep = MyAvatar.position.z > _this.z ? _this.steplength:_this.steplength * -1;
            xstep = 0;

        }else{
            xstep = MyAvatar.position.x > _this.x ? _this.steplength:_this.steplength * -1;
            zstep = 0;
        }



        _this.goforward =  {
            x: MyAvatar.position.x + xstep,
            y: MyAvatar.position.y,
            z: MyAvatar.position.z + zstep

        };

        _this.x = MyAvatar.position.x;
        _this.z = MyAvatar.position.z;
    },100);
});
