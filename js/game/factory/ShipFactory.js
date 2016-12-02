var NavigationSystem = require('./NavigationSystemFactory');
var WeaponsSystem = require('./WeaponsSystemFactory');

function ShipFactory() {

  this.create = function(image) {
    return new this.SpaceShip(image);
  };

  this.SpaceShip = function(imagePath) {

    this.health = 100;
    this.navigationSystem = NavigationSystem.create();
    this.weaponsSystem = WeaponsSystem.create();

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

    this.reSize = function(size) {
      // Default is 1, to scale down use a decimal ie. 0.8
      this.sprite.scaleX = size;
      this.sprite.scaleY = size;
      this.radius = this.radius * Math.abs(size);
      this.sprite.regX = this.sprite.regX * Math.abs(size);
      this.sprite.regY = this.sprite.regY * Math.abs(size);
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
      return this.weaponsSystem.fire(this.getCurrentX(), this.getCurrentY() - this.radius);
    };

    this.switchWeapon = function(type) {
      this.weaponsSystem.switchWeapon(type);
    };

    this.takeDamage = function(amount) {
      this.health = this.health - amount;
      if (this.health < 50) {
        this.sprite.gotoAndPlay("damaged");
      }
    };
  };
}

module.exports = new ShipFactory();
