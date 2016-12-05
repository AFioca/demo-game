var GunFactory = require('./GunFactory');

function WeaponsSystemFactory() {
  this.create = function(config) {
    var weaponsSystem = new this.WeaponsSystem(config);
    weaponsSystem.init(config.gunLocations);
    return weaponsSystem;
  };

  this.WeaponsSystem = function(config) {
    this.guns = [];
    this.gunModes = config.gunModes;
    this.availableProjectiles = config.availableProjectiles;
    this.activeProjectile = config.availableProjectiles[0];
    this.projectileMax = config.gunLocations.length;
    this.projectileCount = 1;

    this.init = function(gunLocations) {
      for (var i = 0; i < this.gunModes.length; i++) {
        this.guns.push(GunFactory.create(gunLocations[i].x,
                                         gunLocations[i].y,
                                         this.activeProjectile));
      }
    };

    this.upgrade = function() {
      if (this.projectileCount < this.projectileMax)
        this.projectileCount = this.projectileCount + 1;
    };

    this.fire = function(x, y) {
      var shell = [];
      for (var i = 0; i < this.projectileCount; i++) {
        // console.log(this.projectileCount);
        // console.log(this.gunModes);
        var n = this.gunModes[this.projectileCount - 1][i];
        console.log(n);
        console.log(this.guns);
        this.guns[n].load(this.activeProjectile);
        shell.push(this.guns[n].fire(x, y));
      }
      return shell;
    };

    this.switchWeapon = function(type) {
      console.log("SWITCH WEAPON");
      console.log(type);
      for (var i = 0; i < this.availableProjectiles.length; i++ ) {
        console.log(this.availableProjectiles[i].name);
        if (this.availableProjectiles[i].name === type) {
          this.activeProjectile = this.availableProjectiles[i];
        }
      }

    };

    this.getAvailableProjectiles = function() {
      return this.availableProjectiles;
    };
  };
}

module.exports = new WeaponsSystemFactory();
