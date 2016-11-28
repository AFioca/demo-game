var Game = require('./game/Game');

window.onload = function(){
  var game = Game.create("game-canvas");
  game.init();
};
