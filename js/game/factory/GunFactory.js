var ProjectileFactory = require('./ProjectileFactory');

function GunFactory() {

  this.create = function(x, y, projectile) {
    return new this.Gun(x, y, projectile);
  };

  this.Gun = function(x, y, projectile) {
    this.x = x;
    this.y = y;
    this.projectile = projectile;

    this.load = function(projectile) {
      this.projectile = projectile;
    };

    this.fire = function(x, y) {
      var projectile = ProjectileFactory.createProjectile(this.projectile, (x + this.x) , (y + this.y));
      projectile.draw();
      return projectile;
    };
  };
}

module.exports = new GunFactory();
