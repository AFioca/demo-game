var ProjectileFactory = require('./ProjectileFactory');

function WeaponsSystemFactory() {
  this.create = function(availableProjectiles) {
    return new this.WeaponsSystem(availableProjectiles);
  };

  this.WeaponsSystem = function(availableProjectiles) {
    this.availableProjectiles = availableProjectiles;
    this.activeProjectile = availableProjectiles[0];

    this.fire = function(x, y) {
      var projectile = ProjectileFactory.createProjectile(this.activeProjectile, x, y);
      projectile.draw();
      return projectile;
    };

    this.switchWeapon = function(type) {
      for (var i = 0; i < this.availableProjectiles.length; i++ ) {
        if (this.availableProjectiles[i].name === type) {
          this.activeProjectile = availableProjectiles[i];
        }
      }

    };

    this.getAvailableProjectiles = function() {
      return this.availableProjectiles;
    };
  };
}

module.exports = new WeaponsSystemFactory();
