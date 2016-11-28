/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);

	window.onload = function(){
	  // init();
	  // configureTicker();
	  var game = Game.create("game-canvas");
	  game.init();
	};










/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Spaceship = __webpack_require__(2);

	function Game(canvasId) {

	  this.stage = new createjs.Stage(canvasId);
	  this.isPaused = false;
	  this.height = this.stage.canvas.height;
	  this.width = this.stage.canvas.width;

	  this.spaceship1 = Spaceship.create(200, 200, "#0F0");
	  this.spaceship2 = Spaceship.create(50, 100, "#F00");

	  this.projectiles = [];
	  this.explosions = [];

	  this.init = function() {
	    this.spaceship1.draw();
	    this.spaceship2.draw();
	    this.stage.addChild(this.spaceship1.getSelf());
	    this.stage.addChild(this.spaceship2.getSelf());
	    this.configureTicker();

	    this.stage.addEventListener("click", this._fire.bind(this));
	  };

	  this.togglePause = function() {
	    this.isPaused = !this.isPaused;
	  };

	  this.configureTicker = function() {
	    createjs.Ticker.useRAF = true; // not sure what this does yt
	    createjs.Ticker.setFPS(60);
	    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	  };

	  this.tick = function() {
	    if (!this.isPaused) {
	      this._moveSpaceship1();
	      this._moveSpaceship2();
	      this._updateProjectiles();
	      this._updateExplosions();
	      this.stage.update();
	    }
	  };

	  this._moveSpaceship1 = function() {
	    if (this.stage.mouseInBounds) {
	      this.spaceship1.moveToX(this.stage.mouseX);
	      this.spaceship1.moveToY(this.stage.mouseY);
	    }
	  };

	  this._moveSpaceship2 = function() {
	    if (this.spaceship2.getLeftBoundry() >= this.width) {
	      this.spaceship2.moveToX(0 - this.spaceship1.radius);
	    }
	    this.spaceship2.moveSpaces(1, 0);
	  };

	  this._fire = function() {
	    if (this.stage.mouseInBounds) {
	      var laser = this.spaceship1.fire();
	      this.stage.addChild(laser.getSelf());
	      this.projectiles.push(laser);
	    }
	  };

	  this._updateProjectiles = function() {
	    this._checkForExpiredProjectiles();
	    this._moveProjectiles();
	  };

	  this._checkForExpiredProjectiles = function() {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      if (this.projectiles[i].isExpired) {
	        this.stage.removeChild(this.projectiles[i].getSelf());
	        this.projectiles.splice(i, 1);
	      }
	    }
	  };

	  this._moveProjectiles = function() {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      var projectile = this.projectiles[i];
	      projectile.move();
	      if(this._collidesWithShip2(projectile)) {
	        // projectile.isExpired = true;
	        // var explosion = new Explostion(this.spaceship2.getCurrentX(), this.spaceship2.getBottomBoundry());
	        // explosion.draw()
	        var explosion = projectile.explode();
	        this.stage.addChild(explosion.getSelf());
	        this.explosions.push(explosion);
	      }
	    }
	  };

	  this._collidesWithShip2 = function(projectile) {
	    return (projectile.getTopBoundry() <= this.spaceship2.getBottomBoundry() &&
	    (projectile.getCurrentX() >= this.spaceship2.getLeftBoundry() &&
	    projectile.getCurrentX() <= this.spaceship2.getRightBoundry()));
	  };

	  this._updateExplosions = function() {
	    for (var i = 0; i < this.explosions.length; i++) {
	      this.explosions[i].explode();
	      if (this.explosions[i].isExpired) {
	        this.stage.removeChild(this.explosions[i].getSelf());
	        this.explosions.splice(i, 1);
	      }
	    }
	  };
	}

	function GameFactory() {
	  this.create = function(canvasId) {
	    return new Game(canvasId);
	  };
	}

	module.exports = new GameFactory();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Laser = __webpack_require__(3);

	function SpaceShip(startingX, startingY, color) {

	  this.triangle = new createjs.Shape();
	  this.startingX = startingX;
	  this.startingY = startingY;
	  this.posX = 0;
	  this.posY = 0;

	  this.radius = 50;
	  this.noOfPoints = 3;
	  this.pointSize = 0.5;
	  this.angle = -90;

	  this.draw = function() {
	    this.triangle.graphics.beginFill(color).drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
	  };

	  this.getSelf = function() {
	    return this.triangle;
	  };

	  this.moveSpaces = function(x, y) {
	    this.posX = this.posX + x;
	    this.posY = this.posY + y;
	    this.triangle.x = this.triangle.x + x;
	    this.triangle.y = this.triangle.y + y;
	  };

	  this.getCurrentX = function() {
	    return (this.posX + this.startingX);
	  };

	  this.getCurrentY = function() {
	    return (this.posY + this.startingY);
	  };

	  this.getLeftBoundry = function() {
	    return (this.posX + this.startingX - this.radius);
	  };

	  this.getRightBoundry = function() {
	    return (this.posX + this.startingX + this.radius);
	  };

	  this.getTopBoundry = function() {
	    return (this.posY + this.startingY - this.radius);
	  };

	  this.getBottomBoundry = function() {
	    return (this.posY + this.startingY + this.radius);
	  };

	  this.moveToX = function (x) {
	    this.posX = x - this.startingX;
	    this.triangle.x = x - this.startingX;
	  };

	  this.moveToY = function (y) {
	    this.posY = y - this.startingY;
	    this.triangle.y = y -this.startingY;
	  };

	  this.fire = function() {
	    var laser = Laser.create(this.getCurrentX(), this.getCurrentY());
	    laser.draw();
	    return laser;
	  };
	}

	function SpaceShipFactory() {
	  this.create = function(startingX, startingY, color) {
	    return new SpaceShip(startingX, startingY, color);
	  }
	}

	module.exports = new SpaceShipFactory();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Explosion = __webpack_require__(4);

	function Laser(startingX, startingY) {

	  this.rectangle = new createjs.Shape();
	  this.startingX = startingX;
	  this.startingY = startingY;
	  this.height = 12;
	  this.width = 6;
	  this.speed = 5;
	  this.isExpired = false;

	  this.draw = function() {
	    this.rectangle.graphics.beginFill("black").drawRect(this.startingX, this.startingY, this.width, this.height);
	  };

	  this.getSelf = function() {
	    return this.rectangle;
	  };

	  this.move = function() {
	    this.rectangle.y = this.rectangle.y - this.speed;
	  };

	  this.getTopBoundry = function() {
	    return (this.rectangle.y + this.startingY - (this.height / 2));
	  };

	  this.getCurrentX = function() {
	    return (this.rectangle.x + this.startingX);
	  };

	  this.getCurrentY = function() {
	    return (this.rectangle.y + this.startingY);
	  };

	  this.explode = function() {
	    this.isExpired = true;
	    var explosion = Explosion.create(this.getCurrentX(), this.getCurrentY());
	    explosion.draw();
	    return explosion;
	  };

	}

	function LaserFactory() {
	  this.create = function(startingX, startingY) {
	    return new Laser(startingX, startingY);
	  };
	}

	module.exports = new LaserFactory();


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Explostion(startingX, startingY) {

	  this.triangle = new createjs.Shape();
	  this.startingX = startingX;
	  this.startingY = startingY;

	  this.radius = 35;
	  this.noOfPoints = 7;
	  this.pointSize = 0.5;
	  this.angle = -90;

	  this.isExpired = false;

	  this.draw = function() {
	    this.triangle.graphics.beginFill("#ff9933").drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
	  };

	  this.getSelf = function() {
	    return this.triangle;
	  };

	  this.explode = function() {
	    this.radius = this.radius + 5;
	    this.angle = this.angle - 20;
	    this.draw();
	    if (this.radius > 60) {
	      this.isExpired = true;
	    }
	  };
	}

	function ExplosionFactory() {
	  this.create = function(startingX, startingY) {
	    return new Explostion(startingX, startingY);
	  };
	}

	module.exports = new ExplosionFactory();


/***/ }
/******/ ]);