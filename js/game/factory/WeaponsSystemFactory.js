var ProjectileFactory = require('./ProjectileFactory');

function WeaponsSystemFactory() {
  this.create = function() {
    return new this.WeaponsSystem();
  };

  this.WeaponsSystem = function() {
    this.activeProjectile = "laser";
    this.availableProjectileTypes = ["laser", "plasma", "light"];

    this.fire = function(x, y) {
      var projectile = ProjectileFactory.getProjectile(this.activeProjectile, x, y);
      projectile.draw();
      return projectile;
    };

    this.switchWeapon = function(type) {
      this.activeProjectile = type;
    };

    this.getAvailableProjectiles = function() {
      return this.availableProjectileTypes;
    };
  };
}

module.exports = new WeaponsSystemFactory();
