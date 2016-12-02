var Projectiles = require('./Projectiles');

var Ships = {
  PLAYER: {
    health: 100,
    speed: 5,
    availableProjectiles: [Projectiles.LASER, Projectiles.PLASMA, Projectiles.LIGHT],
    spriteSheet: new createjs.SpriteSheet({
      images: ["/demo-game/img/ship2.png"],
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
    availableProjectiles: [Projectiles.LASER],
    spriteSheet: new createjs.SpriteSheet({
      images: ["/demo-game/img/enemy-spaceship.png"],
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
