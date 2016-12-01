var Spaceship = require('./objects/Spaceship');
var AssetManager = require('./managers/AssetManager');

function Game() {

  this.isPaused = false;
  this.assetManager = AssetManager.create();

  this.healthId = "health";

  this.init = function(gameCanvasId) {
    var stage = new createjs.Stage(gameCanvasId);
    stage.addEventListener("click", this._fire.bind(this));
    this.assetManager.init(stage, 8, 90);
    this._configureTicker();
  };

  this.tick = function() {
    if (!this.isPaused) {
      this.assetManager.updateAssets();
      this._updateHealth();
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
    if (!this.isPaused) {
      this.assetManager.firePlayer1();
    }
  };

  this._updateHealth = function() {
    document.getElementById(this.healthId).innerHTML = this.assetManager.getPlayerHealth();
  };

}

function GameFactory() {
  this.create = function() {
    return new Game();
  };
}

module.exports = new GameFactory();
