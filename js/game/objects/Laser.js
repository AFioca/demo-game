var Explosion = require('./Explosion');

function Laser(startingX, startingY) {

  this.damage = 20;

  this.rectangle = new createjs.Shape();
  this.startingX = startingX;
  this.startingY = startingY;
  this.height = 12;
  this.width = 6;
  this.speed = 5;
  this.isFriendly = true;
  this.isExpired = false;

  this.draw = function() {
    this.rectangle.graphics.beginFill("yellow").drawRect(this.startingX, this.startingY, this.width, this.height);
  };

  this.getSelf = function() {
    return this.rectangle;
  };

  this.move = function() {
    if (this.isFriendly)
      this.rectangle.y = this.rectangle.y - this.speed;
    else
      this.rectangle.y = this.rectangle.y + this.speed;
  };

  this.getTopBoundry = function() {
    // PLUS OR MINUS?
    return (this.rectangle.y + this.startingY - (this.height / 2));
  };

  this.getBottomBoundry = function() {
    return (this.rectangle.y + this.startingY + (this.height / 2));
  };

  this.getCurrentX = function() {
    return (this.rectangle.x + this.startingX);
  };

  this.getCurrentY = function() {
    return (this.rectangle.y + this.startingY);
  };

  this.explode = function() {
    this.isExpired = true;
    var explosion = Explosion.create(this.getCurrentX(), this.getCurrentY());
    explosion.draw();
    return explosion;
  };

}

function LaserFactory() {
  this.create = function(startingX, startingY) {
    return new Laser(startingX, startingY);
  };
}

module.exports = new LaserFactory();
