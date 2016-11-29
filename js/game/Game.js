var Spaceship = require('./objects/Spaceship');
var AssetManager = require('./managers/AssetManager');

function Game(canvasId) {

  this.stage = new createjs.Stage(canvasId);

  this.enemyAttackFrequency = 90;
  this.frameCount = 0;

  this.isPaused = false;
  this.assetManager = AssetManager.create();


  this.init = function() {

    this.assetManager.init(this.stage, 12);
    // add listeners
    this.stage.addEventListener("click", this._fire.bind(this));

    this._configureTicker();

  };

  this.tick = function() {
    if (!this.isPaused) {

      // update player position
      this._updatePlayerLocation();
      // update enemy ship locations
      this.assetManager.moveEnemyShips();
      // npc fire
      this._handleEnemyAttacks();
      // update projectile locations
      this.assetManager.moveProjectiles();
      // check for collisions
      this.assetManager.handleProjectileCollisions(this.stage);
      // update explosions
      this.assetManager.updateExplosions();

      // remove expired assets from stage
      this.assetManager.removeDestroyedShips(this.stage);
      this.assetManager.removeExpiredProjectiles(this.stage);
      this.assetManager.removeExpiredExplosions(this.stage);

      this.stage.update();
    }
  };

  this.togglePause = function() {
    this.isPaused = !this.isPaused;
  };

  this._configureTicker = function() {
    createjs.Ticker.useRAF = true; // not sure what this does yt
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
  };

  this._fire = function() {
    console.log("fire");
    if (!this.isPaused && this.stage.mouseInBounds) {
      this.assetManager.firePlayer1(this.stage);
    }
  };

  this._updatePlayerLocation = function() {
    if (this.stage.mouseInBounds) {
      this.assetManager.movePlayerShip(this.stage.mouseX, this.stage.mouseY);
    }
  };

  this._handleEnemyAttacks = function() {
    this.frameCount = this.frameCount + 1;
    if (this.frameCount >= this.enemyAttackFrequency) {
      this.frameCount = 0;
      this.assetManager.fireEnemyShip(this.stage);
    }
  };
}

function GameFactory() {
  this.create = function(canvasId) {
    return new Game(canvasId);
  };
}

module.exports = new GameFactory();
