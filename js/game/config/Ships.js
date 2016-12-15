var Projectiles = require('./Projectiles');

var Ships = {
  PLAYER: {
    health: 100,
    speed: 5,
    weaponsSystem: {
      availableProjectiles: [Projectiles.LASER, Projectiles.PLASMA, Projectiles.LIGHT],
      gunLocations: [{x: 0, y:-50 },
                     {x: -30, y:-10 },
                     {x: 30, y:-10 }],
      gunModes: [ [0], [1, 2], [0, 1, 2] ]
    },
    spriteSheet: new createjs.SpriteSheet({
      images: ["/space-shooter/img/ship2.png"],
      frames: {width:100, height:100, regX: 50, regY: 50},
      animations: {
        default: {
          frames: [0],
          speed: 0.1
        },
        damaged: {
          frames: [0],
          speed: 0.1
        }
      }
    }),
    widthModifier: 50,
    heightModifier: 50
  },
  DRONE: {
    health: 100,
    speed: 3,
    weaponsSystem: {
      availableProjectiles: [Projectiles.LASER],
      gunLocations: [ {x: 0, y:50 }],
      gunModes: [ [0] ]
    },
    spriteSheet: new createjs.SpriteSheet({
      images: ["/space-shooter/img/enemy-spaceship.png"],
      frames: {width:100, height:100, regX: 50, regY: 50},
      animations: {
        default: {
          frames: [0, 1],
          speed: 0.1
        },
        damaged: {
          frames: [2, 3],
          speed: 0.1
        }
      }
    }),
    widthModifier: 50,
    heightModifier: 50
  }
};

module.exports = Ships;
