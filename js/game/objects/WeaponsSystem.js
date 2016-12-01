var ProjectileFactory = require('./ProjectileFactory');

function WeaponsSystem() {

  this.activeProjectile = "laser";
  this.availableProjectileTypes = ["laser"];

  this.fire = function(x, y) {
    var projectile = ProjectileFactory.getProjectile(this.activeProjectile, x, y);
    projectile.draw();
    return projectile;
  };
}

function WeaponsSystemFactory() {
  this.create = function() {
    return new WeaponsSystem();
  };
}

module.exports = new WeaponsSystemFactory();
