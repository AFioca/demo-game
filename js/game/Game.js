var Spaceship = require('./objects/Spaceship');
var StageManager = require('./managers/StageManager');

function Game(canvasId) {

  this.player1 = Spaceship.create(0, 0, "#0F0", "/demo-game/img/spaceship.png");
  this.isPaused = false;
  this.stageManager = StageManager.create(canvasId, 2);

  this.init = function() {
    this.stageManager.init(this.player1);

    this._configureTicker();

    this.stageManager.stage.addEventListener("click", this._fire.bind(this));
  };

  this.tick = function() {
    if (!this.isPaused) {
      this.stageManager.update(this.player1);
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
    if (!this.isPaused && this.stageManager.mouseIsInBounds()) {
      var laser = this.player1.fire();
      this.stageManager.addProjectile(laser);
    }
  };
}

function GameFactory() {
  this.create = function(canvasId) {
    return new Game(canvasId);
  };
}

module.exports = new GameFactory();
