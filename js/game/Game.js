var AssetManager = require('./AssetManager');

function Game() {

  this.isPaused = false;
  this.stage = null;

  this.assetManager = AssetManager.create();

  // create config object?
  this.noOfEnemies = 6;
  this.enemyAttackFrequency = 90;

  this.init = function(gameCanvasId) {
    this.stage = new createjs.Stage(gameCanvasId);
    this.assetManager.init(this.stage, this.noOfEnemies, this.enemyAttackFrequency);
    this._configureTicker();
  };

  this.tick = function() {
    if (!this.isPaused) {
      this.assetManager.updateAssets();
      if (this.move) {
        this.assetManager.player1.move(this.move);
      }
    }
    this.stage.update();
  };

  this.togglePause = function() {
    this.isPaused = !this.isPaused;
  };

  this.getAvailableProjectiles = function() {
    return this.assetManager.player1.weaponsSystem.getAvailableProjectiles();
  };

  this.switchProjectile = function(type) {
    this.assetManager.player1.switchWeapon(type);
  };

  this.reset = function() {
    this.isPaused = true;
    this.stage.clear();
    this.stage.removeAllChildren();
    this.assetManager = AssetManager.create();
    this.assetManager.init(this.stage, this.noOfEnemies, this.enemyAttackFrequency);
    this.isPaused = false;
  };

  this.moveUp = function() {
    this.move = "up";
  };

  this.moveRight = function() {
    this.move = "right";
  };

  this.moveDown = function() {
    this.move = "down";
  };

  this.moveLeft = function() {
    this.move = "left";
  };

  this.clearMove = function() {
    this.move = null;
  };

  this._configureTicker = function() {
    createjs.Ticker.useRAF = true; // not sure what this does yt
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
  };

  this.fire = function() {
    if (!this.isPaused) {
      this.assetManager.firePlayer1();
    }
  };

}

function GameFactory() {
  this.create = function() {
    return new Game();
  };
}

module.exports = new GameFactory();
