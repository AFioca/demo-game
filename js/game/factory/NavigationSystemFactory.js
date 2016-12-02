var NumberUtility = require('../NumberUtility');

function NavigationSystemFactory() {
  this.create = function() {
    return new this.NavigationSystem();
  };

  this.NavigationSystem = function() {
    this.directions = ["up", "down", "left", "right"];
    this.direction = this.directions[NumberUtility.getRandomNumberBetween(0, 3)]; // For now, up, down, right, left
    this.maxPersistance = 120;
    this.persistanceCount = NumberUtility.getRandomNumberBetween(1, this.maxPersistance); // random number
    this.persistanceAttempts = 0;

    this.resetPersistantCount = function() {
      this.persistanceCount = NumberUtility.getRandomNumberBetween(1, this.maxPersistance);
      this.persistanceAttempts = 0;
    };

    this.resetDirection = function() {
      var newDirection = null;
      var newDirectionSet = false;
      while (!newDirectionSet) {
        newDirection = this.directions[NumberUtility.getRandomNumberBetween(0,3)];
        if (newDirection !== this.direction) {
          this.direction = newDirection;
          newDirectionSet = true;
        }
      }
    };

    this.incrementAttempts = function() {
      if (this.persistanceAttempts != this.persistanceCount) {
        this.persistanceAttempts = this.persistanceAttempts + 1;
      } else {
        this.resetDirection();
        this.resetPersistantCount()
      }

    };
  };
}

module.exports = new NavigationSystemFactory();
