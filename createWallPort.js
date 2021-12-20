//
// This spawns a zone which moves an Avatar some steps forward
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var SCRIPT_URL ="E:\\Github\\Vircadia\\go.js";


var infront = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 0, z: -1 }));


// An entity is described and created by specifying a map of properties
var Wallport = Entities.addEntity({
    type: "Box",
    name: "WallPort",
    position: infront,
    rotation: MyAvatar.orientation,
    dimensions: {
        x: 1.4424810409545898,
        y: 2.246469259262085,
        z: 0.804209291934967
    },
    color:{
        "red": 0,
        "green": 0,
        "blue": 0
    },
    alpha: 0.20,
    dynamic: false,
    grab:{
        "grabbable": false,
    },
    collisionless: true,
    ignoreForCollisions: true,
    shape: "Cube",
    script: SCRIPT_URL,

});

Script.stop();
