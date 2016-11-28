var Laser = require('./Laser');

function SpaceShip(startingX, startingY, color) {

  this.triangle = new createjs.Shape();
  this.startingX = startingX;
  this.startingY = startingY;
  this.posX = 0;
  this.posY = 0;

  this.radius = 50;
  this.noOfPoints = 3;
  this.pointSize = 0.5;
  this.angle = -90;

  this.draw = function() {
    this.triangle.graphics.beginFill(color).drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
  };

  this.getSelf = function() {
    return this.triangle;
  };

  this.moveSpaces = function(x, y) {
    this.posX = this.posX + x;
    this.posY = this.posY + y;
    this.triangle.x = this.triangle.x + x;
    this.triangle.y = this.triangle.y + y;
  };

  this.getCurrentX = function() {
    return (this.posX + this.startingX);
  };

  this.getCurrentY = function() {
    return (this.posY + this.startingY);
  };

  this.getLeftBoundry = function() {
    return (this.posX + this.startingX - this.radius);
  };

  this.getRightBoundry = function() {
    return (this.posX + this.startingX + this.radius);
  };

  this.getTopBoundry = function() {
    return (this.posY + this.startingY - this.radius);
  };

  this.getBottomBoundry = function() {
    return (this.posY + this.startingY + this.radius);
  };

  this.moveToX = function (x) {
    this.posX = x - this.startingX;
    this.triangle.x = x - this.startingX;
  };

  this.moveToY = function (y) {
    this.posY = y - this.startingY;
    this.triangle.y = y -this.startingY;
  };

  this.fire = function() {
    var laser = Laser.create(this.getCurrentX(), this.getCurrentY());
    laser.draw();
    return laser;
  };
}

function SpaceShipFactory() {
  this.create = function(startingX, startingY, color) {
    return new SpaceShip(startingX, startingY, color);
  }
}

module.exports = new SpaceShipFactory();
