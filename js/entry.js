var Game = require('./game/Game');

$( document ).ready(function() {
  // create game
  var game = Game.create();
  game.init("game-canvas");

  // add control listeners
  $("#pause").click(function() {
    game.togglePause();
  });
});
