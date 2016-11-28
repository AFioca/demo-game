var Game = require('./game/Game');

window.onload = function(){
  // init();
  // configureTicker();
  var game = Game.create("game-canvas");
  game.init();
};
