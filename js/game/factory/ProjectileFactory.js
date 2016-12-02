var Projectiles = require('../config/Projectiles');
var ExplosionFactory = require('./ExplosionFactory');

function ProjectileFactory() {

  this.getProjectile = function(type, x, y) {
    if (type === "laser")
      return new this.Projectile(x, y, Projectiles.LASER);
    else if (type === "plasma")
      return new this.Projectile(x, y, Projectiles.PLASMA);
    else if (type === "light")
      return new this.Projectile(x, y, Projectiles.LIGHT);
  };

  this.Projectile = function(startingX, startingY, config) {
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
      var explosion = ExplosionFactory.create(this.getCurrentX(), this.getCurrentY());
      explosion.draw();
      return explosion;
    };
  };
}

module.exports = new ProjectileFactory();



