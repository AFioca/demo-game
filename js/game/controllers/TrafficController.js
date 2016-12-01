
function TrafficController() {

  this.pathIsClear = function(ship, ships, projectiles, height, width) {
    return !(this._willCollideWithBorder(ship, height, width) ||
             this._willCollideWithShips(ship, ships) ||
             this._willCollideWithProjectiles(ship, projectiles));
  };

  this._willCollideWithProjectiles = function(ship, projectiles) {
    var direction = ship.getDirection();
    var willCollide = false;
    for (var n = 0; n < projectiles.length; n++) {
      if (direction === "right" && ship.collidesWithCoordinates(projectiles[n].getCurrentX() - 1)) {
        willCollide = true;
      } else if (direction === "left" && ship.collidesWithCoordinates(projectiles[n].getCurrentX() + 1)) {
        willCollide = true;
      } else if (direction === "up" && ship.collidesWithCoordinates(projectiles[n].getCurrentY() + 1)) {
        willCollide = true;
      } else if (direction === "down" && ship.collidesWithCoordinates(projectiles[n].getCurrentY() - 1)) {
        willCollide = true;
      }
    }
    return willCollide;
  };

  this._willCollideWithBorder = function(ship, height, width) {
    var direction = ship.getDirection();
    var willCollide = false;
    if (direction === "right" && (ship.getRightBoundry() + 1) > width) {
      willCollide = true;
    } else if (direction === "left" && (ship.getLeftBoundry() - 1) < 0) {
      willCollide = true;
    } else if (direction === "up" && (ship.getTopBoundry() - 1) < 0) {
      willCollide = true;
    } else if (direction === "down" && (ship.getTopBoundry() + 1) > height) {
      willCollide = true;
    }
    return willCollide;
  };

  this._willCollideWithShips = function(ship, ships) {
    // doesn't quite work yet...
    var direction = ship.getDirection();
    var willCollide = false;
    for (var n = 0; n < ships.length; n++) {
      if (direction === "right" && ships[n].collidesWithCoordinates(ship.getRightBoundry() + 1, ship.getCurrentY())) {
        willCollide = true;
      } else if (direction === "left" && ships[n].collidesWithCoordinates(ship.getLeftBoundry() - 1, ship.getCurrentY())) {
        willCollide = true;
      } else if (direction === "up" && ships[n].collidesWithCoordinates(ship.getTopBoundry() - 1, ship.getCurrentY())) {
        willCollide = true;
      } else if (direction === "down" && ships[n].collidesWithCoordinates(ship.getTopBoundry() + 1, ship.getCurrentY())) {
        willCollide = true;
      }
    }
    return willCollide;
  };
}

var trafficController = new TrafficController();
module.exports = trafficController;
