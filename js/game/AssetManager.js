var NumberUtility = require('./NumberUtility');
var ShipFactory = require('./factory/ShipFactory');
var TrafficController = require('./controllers/TrafficController');

function AssetManager() {

  this.stage = null;
  this.height = null;
  this.width = null;

  this.backgroundImage1 = new createjs.Bitmap("/demo-game/img/space-background.png");
  this.backgroundImage2 = new createjs.Bitmap("/demo-game/img/space-background.png");

  this.player1 = ShipFactory.createPlayerShip();
  this.projectiles = [];
  this.explosions = [];
  this.enemyShips = [];

  this.enemyAttackFrequency = 90;
  this.frameCount = 0;

  this.init = function(stage, enemyShipCount, attackFreq) {
    this.stage = stage;
    this.height = stage.canvas.height;
    this.width = stage.canvas.width;
    this.enemyAttackFrequency = attackFreq;
    this._setupAssets(enemyShipCount);
    this._addAssetsToStage(stage);
  };

  this.firePlayer1 = function() {
    this._addProjectiles(this.player1.fire(), true);
  };

  this.updateAssets = function() {
    this._moveBackground();
    this._moveEnemyShips();
    this._attackWithEnemyShips(this.stage);
    this._moveProjectiles();
    this._handleProjectileCollisions(this.stage);
    this._updateExplosions();

    this._removeDestroyedShips(this.stage);
    this._removeExpiredProjectiles(this.stage);
    this._removeExpiredExplosions(this.stage);

    // this.stage.update();
  };

  this.getPlayerHealth = function() {
    return this.player1.health;
  };

  /** PRIVATE METHODS **/

  this._setupAssets = function(enemyShipCount) {
    this.backgroundImage2.y = -this.height + 1;
    this.player1.moveToX(this.width/2);
    this.player1.moveToY(this.height-100);
    this.player1.reSize(0.8);
    this._createEnemyShips(enemyShipCount);
  };

  this._addAssetsToStage = function(stage) {
    stage.addChild(this.backgroundImage1);
    stage.addChild(this.backgroundImage2);
    for (var i = 0; i < this.enemyShips.length; i++) {
      stage.addChild(this.enemyShips[i].getSelf());
    }
    stage.addChild(this.player1.getSelf());
  };

  this._createEnemyShips = function(enemyShipCount) {
    // this logic is ideal for up to 12 ships on an 800 px wide canvas, I'm defering
    // making this more dynamic since this is a proof of concept
    var startingX = 50;
    var startingY = 80;
    for (var i = 0; i < enemyShipCount; i++) {
      var enemyShip = ShipFactory.createDroneShip();
      if (startingX >= this.width + enemyShip.radius) {
        startingX = 50;
        startingY = startingY + 110;
      }
      enemyShip.moveToX(startingX);
      enemyShip.moveToY(startingY);
      enemyShip.reSize(0.8);
      this.enemyShips.push(enemyShip);
      startingX = startingX + 100;
    }
  };

  this._moveEnemyShips = function() {
    for (var n = 0; n < this.enemyShips.length; n++) {
      var ship = this.enemyShips[n];
      if (TrafficController.pathIsClear(ship, this.enemyShips, this.projectiles, this.height - 400, this.width)) {
        ship.move();
      }
      ship.moveAttemptCompleted();
    }
  };

  this._attackWithEnemyShips = function(stage) {
    this.frameCount = this.frameCount + 1;
    if (this.frameCount >= this.enemyAttackFrequency) {
      this.frameCount = 0;
      this._fireEnemyShip(stage);
    }
  };

  this._moveProjectiles = function() {
    for (var i = 0; i < this.projectiles.length; i++) {
      var projectile = this.projectiles[i];
      projectile.move();
      var xValue = projectile.getCurrentX();
      var yValue = projectile.getCurrentY();
      if (xValue > this.width || xValue < 0) {
        projectile.isExpired = true;
      } else if (yValue > this.height || yValue < 0) {
        projectile.isExpired = true;
      }
    }
  };

  this._handleProjectileCollisions = function(stage) {
    for (var i = 0; i < this.projectiles.length; i++) {
      var projectile = this.projectiles[i];
      if (projectile.isFriendly) {
        console.log("friendly projectile");
        this._handleEnemyCollision(stage, projectile);
      } else if (this.player1.collidesWithCoordinates(projectile.getCurrentX(), projectile.getCurrentY())) {
        this._handleCollision(projectile, this.player1, stage);
      }
    }
  };

  this._updateExplosions = function() {
    for (var i = 0; i < this.explosions.length; i++) {
      this.explosions[i].explode();
    }
  };

  this._removeDestroyedShips = function(stage) {
    for (var i = 0; i < this.enemyShips.length; i++) {
      if (this.enemyShips[i].health <= 0) {
        stage.removeChild(this.enemyShips[i].getSelf());
        this.enemyShips.splice(i, 1);
      }
    }
  };

  this._removeExpiredProjectiles = function(stage) {
    for (var i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].isExpired) {
        stage.removeChild(this.projectiles[i].getSelf());
        this.projectiles.splice(i, 1);
      }
    }
  };

  this._removeExpiredExplosions = function(stage) {
    for (var i = 0; i < this.explosions.length; i++) {
      if (this.explosions[i].isExpired) {
        stage.removeChild(this.explosions[i].getSelf());
        this.explosions.splice(i, 1);
      }
    }
  };

  this._fireEnemyShip = function(stage) {
    if (this.enemyShips.length > 0) {
      var randomIndex = NumberUtility.getRandomNumberBetween(this.enemyShips.length - 1, 0);
      this._addProjectiles(this.enemyShips[randomIndex].fire(), false);
    }
  };

  this._addProjectiles = function(newProjectiles, isFriendly) {
    for (var i = 0; i < newProjectiles.length; i++) {
      this.projectiles.push(newProjectiles[i]);
      newProjectiles[i].isFriendly = isFriendly;
      this.stage.addChild(newProjectiles[i].getSelf());
    }
  };

  this._moveBackground = function() {
    if (this.backgroundImage1.y > this.height) {
      this.backgroundImage1.y = -this.height + 1;
    }
    if (this.backgroundImage2.y > this.height) {
      this.backgroundImage2.y = -this.height + 1;
    }
    this.backgroundImage1.y = this.backgroundImage1.y + 0.5;
    this.backgroundImage2.y = this.backgroundImage2.y + 0.5;
  };

  this._handleEnemyCollision = function(stage, projectile) {
    for (var i = 0; i < this.enemyShips.length; i++) {
      var enemyShip = this.enemyShips[i];
      if (enemyShip.collidesWithCoordinates(projectile.getCurrentX(), projectile.getCurrentY())) {
        this._handleCollision(projectile, enemyShip, stage);
        // want to avoid colliding with multiple ships for now
        break;
      }
    }
  };

  this._handleCollision = function(projectile, ship, stage) {
    ship.takeDamage(projectile.damage);
    var explosion = projectile.explode();
    stage.addChild(explosion.getSelf());
    this.explosions.push(explosion);
  };
}

function AssetManagerFactory() {
  this.create = function() {
    return new AssetManager();
  };
}

module.exports = new AssetManagerFactory();
