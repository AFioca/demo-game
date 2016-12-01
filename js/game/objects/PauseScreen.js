
function PauseScreen() {

  this.pauseBackground = new createjs.Shape();

  this.pauseText = new createjs.Text("PAUSED", "40px Arial", "#000000");
  this.chooseText = new createjs.Text("Choose Your Weapon", "30px Arial", "#000066");
  this.laserText = new createjs.Text("Laser", "20px Arial", "#660000");
  this.plasmaText = new createjs.Text("Plasma", "20px Arial", "#660000");

  this.selectedWeapon = "laser";

  this.init = function(stage) {
    this.pauseBackground.graphics.beginFill("#FFF").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    stage.addChild(this.pauseBackground);

    this.pauseText.x = (stage.canvas.width / 2) - 80;
    this.pauseText.y = 150;
    stage.addChild(this.pauseText);

    this.chooseText.x = (stage.canvas.width / 2) - 145;
    this.chooseText.y = 250;
    stage.addChild(this.chooseText);

    this.laserText.x = (stage.canvas.width / 2) - 100;
    this.laserText.y = 300;
    this.laserText.addEventListener("click", this._setToLaser.bind(this));
    stage.addChild(this.laserText);
    // this.laserText.addEventListener("click", this._switchWeapon.bind(this));

    this.plasmaText.x = (stage.canvas.width / 2) + 30;
    this.plasmaText.y = 300;
    this.plasmaText.addEventListener("click", this._setToPlasma.bind(this));
    stage.addChild(this.plasmaText);
  };

  this.tearDown = function(stage) {
    stage.removeChild(this.pauseBackground);
    stage.removeChild(this.pauseText);
    stage.removeChild(this.chooseText);
    stage.removeChild(this.laserText);
    stage.removeChild(this.plasmaText);
    return this.selectedWeapon;
  };

  this._setToLaser = function() {
    console.log("laser");
    this.selectedWeapon = "laser";
  };

  this._setToPlasma = function() {
    console.log("plasma");
    this.selectedWeapon = "plasma";
  }
}

function PauseScreenFactory() {
  this.create = function() {
    return new PauseScreen();
  };
}

module.exports = new PauseScreenFactory();
