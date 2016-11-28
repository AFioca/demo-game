var Spaceship = require('./objects/Spaceship');

function Game(canvasId) {

  this.stage = new createjs.Stage(canvasId);
  this.isPaused = false;
  this.height = this.stage.canvas.height;
  this.width = this.stage.canvas.width;

  // this.spaceship1 = Spaceship.create(200, 200, "#0F0");
  this.spaceship1 = Spaceship.create(0, 0, "#0F0", "/demo-game/img/spaceship.png");

  this.enemyShipCount = 2;
  this.projectiles = [];
  this.explosions = [];
  this.enemyShips = [];

  this.init = function() {
    this.spaceship1.draw();
    this.stage.addChild(this.spaceship1.getSelf());

    this._createEnemyShips();

    this.configureTicker();

    this.stage.addEventListener("click", this._fire.bind(this));
  };

  this.togglePause = function() {
    this.isPaused = !this.isPaused;
  };

  this.configureTicker = function() {
    createjs.Ticker.useRAF = true; // not sure what this does yt
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
  };

  this.tick = function() {
    if (!this.isPaused) {
      this._moveSpaceship1();
      // this._moveSpaceship2();
      this._moveEnemyShips();
      this._updateProjectiles();
      this._updateExplosions();
      this.stage.update();
    }
  };

  this._moveSpaceship1 = function() {
    if (this.stage.mouseInBounds) {
      this.spaceship1.moveToX(this.stage.mouseX);
      this.spaceship1.moveToY(this.stage.mouseY);
    }
  };

  this._moveEnemyShips = function() {
    for (var i = 0; i < this.enemyShipCount; i++) {
      if (this.enemyShips[i].getLeftBoundry() >= this.width) {
        this.enemyShips[i].moveToX(0 - this.enemyShips[i].radius);
      }
      this.enemyShips[i].moveSpaces(1, 0);
    }
  };

  this._fire = function() {
    console.log("fire");
    if (this.stage.mouseInBounds) {
      var laser = this.spaceship1.fire();
      this.stage.addChild(laser.getSelf());
      this.projectiles.push(laser);
    }
  };

  this._updateProjectiles = function() {
    this._checkForExpiredProjectiles();
    this._moveProjectiles();
  };

  this._checkForExpiredProjectiles = function() {
    for (var i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].isExpired) {
        this.stage.removeChild(this.projectiles[i].getSelf());
        this.projectiles.splice(i, 1);
      }
    }
  };

  this._moveProjectiles = function() {
    for (var i = 0; i < this.projectiles.length; i++) {
      var projectile = this.projectiles[i];
      projectile.move();
      this._handleEnemyCollisions(projectile);
    }
  };

  this._handleEnemyCollisions = function(projectile) {
    for (var i = 0; i < this.enemyShipCount; i++) {
      if(this._collidesWithEnemyShip(this.enemyShips[i], projectile)) {
        var explosion = projectile.explode();
        this.stage.addChild(explosion.getSelf());
        this.explosions.push(explosion);
      }
    }
  };

  this._collidesWithEnemyShip = function(ship, projectile) {
    return (projectile.getTopBoundry() <= ship.getBottomBoundry() &&
    (projectile.getCurrentX() >= ship.getLeftBoundry() &&
    projectile.getCurrentX() <= ship.getRightBoundry()));
  };

  this._updateExplosions = function() {
    for (var i = 0; i < this.explosions.length; i++) {
      this.explosions[i].explode();
      if (this.explosions[i].isExpired) {
        this.stage.removeChild(this.explosions[i].getSelf());
        this.explosions.splice(i, 1);
      }
    }
  };

  this._createEnemyShips = function() {
    var startingX = 50;
    var startingY = 50;
    for (var i = 0; i < this.enemyShipCount; i++) {
      var enemyShip = Spaceship.create(startingX, startingY, "#F00");
      enemyShip.draw();
      this.stage.addChild(enemyShip.getSelf());
      this.enemyShips.push(enemyShip);
      startingX = startingX + 100;
      startingY = startingY + 100;
    }
  };
}

function GameFactory() {
  this.create = function(canvasId) {
    return new Game(canvasId);
  };
}

module.exports = new GameFactory();
