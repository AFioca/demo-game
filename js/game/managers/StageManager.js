var Spaceship = require('../objects/Spaceship');

function StageManager(canvasId, enemyShipCount) {

  this.stage = new createjs.Stage(canvasId);
  this.height = this.stage.canvas.height;
  this.width = this.stage.canvas.width;

  this.backgroundImage1 = new createjs.Bitmap("/demo-game/img/space-background.png");
  this.backgroundImage2 = new createjs.Bitmap("/demo-game/img/space-background.png");


  this.enemyShipCount = enemyShipCount;
  this.projectiles = [];
  this.explosions = [];
  this.enemyShips = [];

  this.init = function(playerShip) {
    this.stage.addChild(this.backgroundImage1);
    this.stage.addChild(this.backgroundImage2)
    this.backgroundImage2.y = -this.height;
    this._createEnemyShips();
    this.stage.addChild(playerShip.getSelf());
    playerShip.moveToX(this.width/2);
    playerShip.moveToY(this.height-100);
  };

  this.update = function(playerShip) {
    this._moveBackground();
    this._movePlayerShip(playerShip);
    this._updateEnemyShips();
    this._updateProjectiles();
    this._updateExplosions();
    this.stage.update();
  };

  this.addProjectile = function(projectile) {
    this.stage.addChild(projectile.getSelf());
    this.projectiles.push(projectile);
  };

  this.mouseIsInBounds = function() {
    return this.stage.mouseInBounds;
  };

  this._createEnemyShips = function() {
    var startingX = 50;
    var startingY = 60;
    for (var i = 0; i < this.enemyShipCount; i++) {
      var enemyShip = Spaceship.create("/demo-game/img/enemy-spaceship.png");
      this.stage.addChild(enemyShip.getSelf());
      enemyShip.moveToX(startingX);
      enemyShip.moveToY(startingY);
      this.enemyShips.push(enemyShip);
      startingX = startingX + 75;
      if (startingY > 100) {
        startingY = startingY - 110;
      } else {
        startingY = startingY + 110;
      }
    }
  };

  this._moveBackground = function() {
    if (this.backgroundImage1.y > this.height) {
      this.backgroundImage1.y = -this.height;
    }
    if (this.backgroundImage2.y > this.height) {
      this.backgroundImage2.y = -this.height;
    }
    this.backgroundImage1.y = this.backgroundImage1.y + 0.5;
    this.backgroundImage2.y = this.backgroundImage2.y + 0.5;
  };

  this._movePlayerShip = function(playerShip) {
    if (this.stage.mouseInBounds) {
      playerShip.moveToX(this.stage.mouseX);
      playerShip.moveToY(this.stage.mouseY);
    }
  };

  this._updateEnemyShips = function() {
    this._removeDestroyedShips();
    this._moveEnemyShips();
  };

  this._removeDestroyedShips = function() {
    for (var i = 0; i < this.enemyShips.length; i++) {
      if (this.enemyShips[i].health <= 0) {
        this.stage.removeChild(this.enemyShips[i].getSelf());
        this.enemyShips.splice(i, 1);
      }
    }
  };

  this._moveEnemyShips = function() {
    for (var i = 0; i < this.enemyShips.length; i++) {
      if (this.enemyShips[i].getCurrentY() < 100) {
        if (this.enemyShips[i].getLeftBoundry() >= this.width) {
          this.enemyShips[i].moveToX(0 - this.enemyShips[i].radius);
        }
        this.enemyShips[i].moveSpaces(1, 0);
      } else {
        if (this.enemyShips[i].getRightBoundry() <= 0) {
          this.enemyShips[i].moveToX(this.width + this.enemyShips[i].radius);
        }
        this.enemyShips[i].moveSpaces(-1, 0);
      }
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
    for (var i = 0; i < this.enemyShips.length; i++) {
      if(this._collidesWithEnemyShip(this.enemyShips[i], projectile)) {
        this.enemyShips[i].takeDamage(projectile.damage);
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
}

function StageManagerFactory() {
  this.create = function(canvasId, enemyShipCount) {
    return new StageManager(canvasId, enemyShipCount);
  };
}

module.exports = new StageManagerFactory();
