var Laser = require('./Laser');

// so for now, if you use an image you need the startingX and startingY args to be 0
function SpaceShip(startingX, startingY, color, imagePath) {

  this.triangle = new createjs.Shape();
  this.imagePath = imagePath;
  this.color = color;
  this.startingX = startingX;
  this.startingY = startingY;
  this.posX = 0;
  this.posY = 0;

  this.radius = 50;
  this.noOfPoints = 3;
  this.pointSize = 0.5;
  this.angle = -90;

  this.draw = function() {
    if (this.imagePath) {
      this.triangle = new createjs.Bitmap(imagePath);
      this.triangle.regX = 50;
      this.triangle.regY = 50;
      this.triangle.x = this.startingX;
      this.triangle.y = this.startingY;
    } else {
      this.triangle = new createjs.Shape();
      this.triangle.graphics.beginFill(this.color).drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
    }
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
    var laser = Laser.create(this.getCurrentX(), this.getCurrentY() - this.radius);
    laser.draw();
    return laser;
  };
}

function SpaceShipFactory() {
  this.create = function(startingX, startingY, color, image) {
    return new SpaceShip(startingX, startingY, color, image);
  }
}

module.exports = new SpaceShipFactory();
