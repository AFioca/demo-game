var Projectiles = {
  LASER: {
    name: "laser",
    speed: 5,
    damage: 20,
    height: 12,
    width: 6,
    color: "yellow",
    getShape: function(x, y) {
      var rectangle = new createjs.Shape();
      rectangle.graphics.beginFill(this.color).drawRect(0, 0, this.width, this.height);
      rectangle.x = x;
      rectangle.y = y;
      return rectangle;
    },
    getHeightModifier: function() {
      return this.height / 2;
    }
  },
  PLASMA: {
    name: "plasma",
    speed: 10,
    damage: 40,
    radius: 50,
    color: "#0F0",
    getShape: function(x, y) {
      var circle = new createjs.Shape();
      circle.graphics.beginFill(this.color).drawCircle(0, 0, 10);
      circle.x = x;
      circle.y = y;
      return circle;
    },
    getHeightModifier: function() {
      return this.radius;
    }
  },
  LIGHT: {
    name: "light",
    speed: 15,
    damage: 100,
    radius: 150,
    color: "#FFF",
    getShape: function(x, y) {
      var circle = new createjs.Shape();
      circle.graphics.beginFill(this.color).drawCircle(0, 0, 10);
      circle.x = x;
      circle.y = y;
      return circle;
    },
    getHeightModifier: function() {
      return this.radius;
    }
  }
};

module.exports = Projectiles;
