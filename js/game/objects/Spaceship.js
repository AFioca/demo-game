var Laser = require('./Laser');
var NavigationSystem = require('./NavigationSystem');

function SpaceShip(imagePath) {

  // game attributes
  this.health = 100;

  this.navigationSystem = NavigationSystem.create();

  // visual attributes
  this.spriteSheet = new createjs.SpriteSheet({
    images: [imagePath],
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
  });
  this.sprite = new createjs.Sprite(this.spriteSheet, "default");
  this.radius = 50;

  this.getSelf = function() {
    return this.sprite;
  };

  this.move = function() {
    var direction = this.navigationSystem.direction;
    if (direction === "right") {
      this.moveSpaces(1, 0);
    } else if (direction === "left") {
      this.moveSpaces(-1, 0);
    } else if (direction === "up") {
      this.moveSpaces(0, -1);
    } else if (direction === "down") {
      this.moveSpaces(0, 1);
    }

  };

  this.moveAttemptCompleted = function() {
    this.navigationSystem.incrementAttempts();
  };

  this.moveSpaces = function(x, y) {
    this.sprite.x = this.sprite.x + x;
    this.sprite.y = this.sprite.y + y;
  };

  this.getDirection = function() {
    return this.navigationSystem.direction;
  };

  this.collidesWithCoordinates = function(x, y) {
    return (this.isWithinXBoundaries(x) && this.isWithinYBoundaries(y));
  };

  this.isWithinYBoundaries = function(yValue) {
    return (yValue >= this.getTopBoundry() && yValue <= this.getBottomBoundry());
  };

  this.isWithinXBoundaries = function(xValue) {
    return (xValue >= this.getLeftBoundry() && xValue <= this.getRightBoundry());
  };

  this.getCurrentX = function() {
    return this.sprite.x;
  };

  this.getCurrentY = function() {
    return this.sprite.y;
  };

  this.getLeftBoundry = function() {
    return (this.sprite.x - this.radius);
  };

  this.getRightBoundry = function() {
    return (this.sprite.x + this.radius);
  };

  this.getTopBoundry = function() {
    return (this.sprite.y - this.radius);
  };

  this.getBottomBoundry = function() {
    return (this.sprite.y + this.radius);
  };

  this.moveToX = function (x) {
    this.sprite.x = x;
  };

  this.moveToY = function (y) {
    this.sprite.y = y;
  };

  this.fire = function() {
    var laser = Laser.create(this.getCurrentX(), this.getCurrentY() - this.radius);
    laser.draw();
    return laser;
  };

  this.takeDamage = function(amount) {
    this.health = this.health - amount;
    if (this.health < 50) {
      this.sprite.gotoAndPlay("damaged");
    }
  };
}

function SpaceShipFactory() {

  this.create = function(image) {
    return new SpaceShip(image);
  };

}

module.exports = new SpaceShipFactory();
