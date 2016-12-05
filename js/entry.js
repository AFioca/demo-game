var Game = require('./game/Game');

$( document ).ready(function() {
  // create game
  var game = Game.create();
  game.init("game-canvas");

  var projectileChoices = game.getAvailableProjectiles();
  var choicesDiv = $('#projectiles');
  for (var i = 0; i < projectileChoices.length; i++) {
    if (projectileChoices[i].name === "laser") {
      choicesDiv.append("<li><input type='radio' name='projectiles' checked value='" + projectileChoices[i].name + "' /> " + projectileChoices[i].name + "</li>");
    } else {
      choicesDiv.append("<li><input type='radio' name='projectiles' value='" + projectileChoices[i].name + "' /> " + projectileChoices[i].name + "</li>");
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

  $("#upgrade").click(function() {
    game.upgradeWeaponsSystem();
    $("#projectile-count").text(game.getProjectileCount());
  });

  // CONTROLS
  $( document ).keydown(function(event) {

    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        game.moveLeft();
        break;
      case 38:
        event.preventDefault();
        game.moveUp();
        break;
      case 39:
        event.preventDefault();
        game.moveRight();
        break;
      case 40:
        event.preventDefault();
        game.moveDown();
        break;
      case 32:
        event.preventDefault();
        game.fire();
        break;
    }
  });

  $( document ).keyup(function(event) {
    if (event.keyCode != 32) {
      game.clearMove();
    }
  });
});
