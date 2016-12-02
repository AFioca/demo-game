var NavigationSystem = require('./NavigationSystemFactory');
var WeaponsSystem = require('./WeaponsSystemFactory');
var Ships = require('../config/Ships');

function ShipFactory() {

  this.createPlayerShip = function() {
    return new this.SpaceShip(Ships.PLAYER);
  };

  this.createDroneShip = function() {
    return new this.SpaceShip(Ships.DRONE);
  };

  this.SpaceShip = function(config) {

    this.health = config.health;
    this.speed = config.speed;
    this.navigationSystem = NavigationSystem.create();
    this.weaponsSystem = WeaponsSystem.create(config.availableProjectiles);

    this.spriteSheet = config.sprite;
    this.sprite = new createjs.Sprite(config.spriteSheet, "default");
    this.widthModifier = config.widthModifier;
    this.heightModifier = config.heightModifier;

    this.getSelf = function() {
      return this.sprite;
    };

    this.move = function(dir) {
      var direction;
      if (dir) {
        direction = dir;
      } else {
        direction = this.navigationSystem.direction;
      }
      if (direction === "right") {
        this.moveRight();
      } else if (direction === "left") {
        this.moveLeft();
      } else if (direction === "up") {
        this.moveUp();
      } else if (direction === "down") {
        this.moveDown();
      }
    };

    this.moveUp = function() {
      this.moveSpaces(0, -this.speed);
    };

    this.moveRight = function() {
      this.moveSpaces(this.speed, 0);
    };

    this.moveDown = function() {
      this.moveSpaces(0, this.speed);
    };

    this.moveLeft = function() {
      this.moveSpaces(-this.speed, 0);
    };

    this.reSize = function(size) {
      // Default is 1, to scale down use a decimal ie. 0.8
      this.sprite.scaleX = size;
      this.sprite.scaleY = size;
      this.widthModifier = this.widthModifier * Math.abs(size);
      this.heightModifier = this.heightModifier * Math.abs(size);
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
      return (this.sprite.x - this.widthModifier);
    };

    this.getRightBoundry = function() {
      return (this.sprite.x + this.widthModifier);
    };

    this.getTopBoundry = function() {
      return (this.sprite.y - this.heightModifier);
    };

    this.getBottomBoundry = function() {
      return (this.sprite.y + this.heightModifier);
    };

    this.moveToX = function (x) {
      this.sprite.x = x;
    };

    this.moveToY = function (y) {
      this.sprite.y = y;
    };

    this.fire = function() {
      return this.weaponsSystem.fire(this.getCurrentX(), this.getCurrentY() - this.heightModifier);
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
