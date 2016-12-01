var Spaceship = require('./objects/Spaceship');
var AssetManager = require('./managers/AssetManager');
var PauseScreen = require('./objects/PauseScreen');

function Game() {

  this.isPaused = false;
  this.stage = null;

  this.assetManager = AssetManager.create();
  this.pauseScreen = PauseScreen.create();

  this.healthId = "health";

  this.init = function(gameCanvasId) {
    this.stage = new createjs.Stage(gameCanvasId);
    this.stage.addEventListener("click", this._fire.bind(this));
    this.assetManager.init(this.stage, 8, 90);
    this._configureTicker();
  };

  this.tick = function() {
    if (!this.isPaused) {
      this.assetManager.updateAssets();
      this._updateHealth();
    }
    this.stage.update();
  };

  this.togglePause = function() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      // probably should pass it some config data or at least the space ship
      this.pauseScreen.init(this.stage);
    } else {
      var selectedweapon = this.pauseScreen.tearDown(this.stage);
      this.assetManager.player1.switchWeapon(selectedweapon);
    }
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
