var Game = require('./game/Game');

$( document ).ready(function() {
  // create game
  var game = Game.create();
  game.init("game-canvas");

  var projectileChoices = game.getAvailableProjectiles();
  var choicesDiv = $('#projectiles');
  for (var i = 0; i < projectileChoices.length; i++) {
    if (projectileChoices[i] === "laser") {
      choicesDiv.append("<li><input type='radio' name='projectiles' checked value='" + projectileChoices[i] + "' /> " + projectileChoices[i] + "</li>");
    } else {
      choicesDiv.append("<li><input type='radio' name='projectiles' value='" + projectileChoices[i] + "' /> " + projectileChoices[i] + "</li>");
    }
  }

  // add control listeners
  $("#pause").click(function() {
    game.togglePause();
  });

  $("#reset").click(function() {
    game.noOfEnemies = $("#number-enemies").val();
    game.enemyAttackFrequency = $("#attack-speed").val();
    console.log(game.noOfEnemies);
    game.reset();
  });

  $('input[name=projectiles]').click(function() {
    game.switchProjectile(this.value);
  });

});
