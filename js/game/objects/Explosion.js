function Explostion(startingX, startingY) {

  this.triangle = new createjs.Shape();
  this.startingX = startingX;
  this.startingY = startingY;

  this.radius = 35;
  this.noOfPoints = 7;
  this.pointSize = 0.5;
  this.angle = -90;

  this.isExpired = false;

  this.draw = function() {
    this.triangle.graphics.beginFill("#ff9933").drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
  };

  this.getSelf = function() {
    return this.triangle;
  };

  this.explode = function() {
    this.radius = this.radius + 5;
    this.angle = this.angle - 20;
    this.draw();
    if (this.radius > 60) {
      this.isExpired = true;
    }
  };
}

function ExplosionFactory() {
  this.create = function(startingX, startingY) {
    return new Explostion(startingX, startingY);
  };
}

module.exports = new ExplosionFactory();
