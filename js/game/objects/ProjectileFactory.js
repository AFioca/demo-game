var Explosion = require('./Explosion');

var Projectiles = {
  LASER: {
    speed: 5,
    damage: 20,
    height: 12,
    width: 6,
    color: "yellow",
    getShape: function(x, y) {
      var rectangle = new createjs.Shape();
      rectangle.graphics.beginFill(this.color).drawRect(0, 0, this.width, this.height);
      rectangle.x = x;
      rectangle.y = y;
      return rectangle;
    },
    getHeightModifier: function() {
      return this.height / 2;
    }
  },
  PLASMA: {
    speed: 10,
    damage: 40,
    radius: 50,
    color: "#0F0",
    getShape: function(x, y) {
      var circle = new createjs.Shape();
      circle.graphics.beginFill(this.color).drawCircle(0, 0, 10);
      circle.x = x;
      circle.y = y;
      return circle;
    },
    getHeightModifier: function() {
      return this.radius;
    }
  }
};

function Projectile(startingX, startingY, config) {

  this.shape = null;

  this.damage = config.damage;
  this.speed = config.speed;
  this.color = config.color;
  this.getShape = config.getShape;
  this.getHeightModifier = config.getHeightModifier;

  this.startingX = startingX;
  this.startingY = startingY;
  this.height = 12;
  this.width = 6;
  this.isFriendly = true;
  this.isExpired = false;

  this.draw = function() {
    this.shape = this.getShape(this.startingX, this.startingY);
  };

  this.getSelf = function() {
    return this.shape;
  };

  this.move = function() {
    if (this.isFriendly)
      this.shape.y = this.shape.y - this.speed;
    else
      this.shape.y = this.shape.y + this.speed;
  };

  this.getTopBoundry = function() {
    // PLUS OR MINUS?
    return (this.shape.y - this.getHeightModifier);
  };

  this.getBottomBoundry = function() {
    return (this.shape.y + this.getHeightModifier);
  };

  this.getCurrentX = function() {
    return (this.shape.x);
  };

  this.getCurrentY = function() {
    return (this.shape.y);
  };

  this.explode = function() {
    this.isExpired = true;
    var explosion = Explosion.create(this.getCurrentX(), this.getCurrentY());
    explosion.draw();
    return explosion;
  };

}

function ProjectileFactory() {

  this.getProjectile = function(type, x, y) {
    if (type === "laser")
      return new Projectile(x, y, Projectiles.LASER);
    else if (type === "plasma")
      return new Projectile(x, y, Projectiles.PLASMA);
  };
}

module.exports = new ProjectileFactory();
