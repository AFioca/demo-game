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
	var StageManager = __webpack_require__(5);

	function Game(canvasId) {

	  this.player1 = Spaceship.create(0, 0, "#0F0", "/demo-game/img/spaceship.png");
	  this.isPaused = false;
	  this.stageManager = StageManager.create(canvasId, 2);

	  this.init = function() {
	    this.stageManager.init(this.player1);

	    this._configureTicker();

	    this.stageManager.stage.addEventListener("click", this._fire.bind(this));
	  };

	  this.tick = function() {
	    if (!this.isPaused) {
	      this.stageManager.update(this.player1);
	    }
	  };

	  this.togglePause = function() {
	    this.isPaused = !this.isPaused;
	  };

	  this._configureTicker = function() {
	    createjs.Ticker.useRAF = true; // not sure what this does yt
	    createjs.Ticker.setFPS(60);
	    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	  };

	  this._fire = function() {
	    console.log("fire");
	    if (!this.isPaused && this.stageManager.mouseIsInBounds()) {
	      var laser = this.player1.fire();
	      this.stageManager.addProjectile(laser);
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

	// so for now, if you use an image you need the startingX and startingY args to be 0
	function SpaceShip(startingX, startingY, color, imagePath) {

	  this.triangle = new createjs.Shape();
	  this.imagePath = imagePath;
	  this.color = color;
	  this.startingX = startingX;
	  this.startingY = startingY;
	  this.posX = 0;
	  this.posY = 0;

	  this.radius = 50;
	  this.noOfPoints = 3;
	  this.pointSize = 0.5;
	  this.angle = -90;

	  this.draw = function() {
	    if (this.imagePath) {
	      this.triangle = new createjs.Bitmap(imagePath);
	      this.triangle.regX = 50;
	      this.triangle.regY = 50;
	      this.triangle.x = this.startingX;
	      this.triangle.y = this.startingY;
	    } else {
	      this.triangle = new createjs.Shape();
	      this.triangle.graphics.beginFill(this.color).drawPolyStar(this.startingX, this.startingY, this.radius, this.noOfPoints, this.pointSize, this.angle);
	    }
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
	    var laser = Laser.create(this.getCurrentX(), this.getCurrentY() - this.radius);
	    laser.draw();
	    return laser;
	  };
	}

	function SpaceShipFactory() {
	  this.create = function(startingX, startingY, color, image) {
	    return new SpaceShip(startingX, startingY, color, image);
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
	    return (this.rectangle.y + this.startingY + (this.height / 2));
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Spaceship = __webpack_require__(2);

	function StageManager(canvasId, enemyShipCount) {

	  this.stage = new createjs.Stage(canvasId);
	  this.height = this.stage.canvas.height;
	  this.width = this.stage.canvas.width;

	  this.enemyShipCount = enemyShipCount;
	  this.projectiles = [];
	  this.explosions = [];
	  this.enemyShips = [];

	  this.init = function(playerShip) {
	    playerShip.draw();
	    this.stage.addChild(playerShip.getSelf());
	    this._createEnemyShips();
	  };

	  this.update = function(playerShip) {
	    this._movePlayerShip(playerShip);
	    this._moveEnemyShips();
	    this._updateProjectiles();
	    this._updateExplosions();
	    this.stage.update();
	  };

	  this.addProjectile = function(projectile) {
	    this.stage.addChild(projectile.getSelf());
	    this.projectiles.push(projectile);
	  };

	  this.mouseIsInBounds = function() {
	    return this.stage.mouseInBounds;
	  };

	  this._createEnemyShips = function() {
	    var startingX = 50;
	    var startingY = 50;
	    for (var i = 0; i < this.enemyShipCount; i++) {
	      var enemyShip = Spaceship.create(startingX, startingY, "#F00");
	      enemyShip.draw();
	      this.stage.addChild(enemyShip.getSelf());
	      this.enemyShips.push(enemyShip);
	      startingX = startingX + 100;
	      startingY = startingY + 100;
	    }
	  };

	  this._movePlayerShip = function(playerShip) {
	    if (this.stage.mouseInBounds) {
	      playerShip.moveToX(this.stage.mouseX);
	      playerShip.moveToY(this.stage.mouseY);
	    }
	  };

	  this._moveEnemyShips = function() {
	    for (var i = 0; i < this.enemyShipCount; i++) {
	      if (this.enemyShips[i].getLeftBoundry() >= this.width) {
	        this.enemyShips[i].moveToX(0 - this.enemyShips[i].radius);
	      }
	      this.enemyShips[i].moveSpaces(1, 0);
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
	      this._handleEnemyCollisions(projectile);
	    }
	  };

	  this._handleEnemyCollisions = function(projectile) {
	    for (var i = 0; i < this.enemyShipCount; i++) {
	      if(this._collidesWithEnemyShip(this.enemyShips[i], projectile)) {
	        var explosion = projectile.explode();
	        this.stage.addChild(explosion.getSelf());
	        this.explosions.push(explosion);
	      }
	    }
	  };

	  this._collidesWithEnemyShip = function(ship, projectile) {
	    return (projectile.getTopBoundry() <= ship.getBottomBoundry() &&
	    (projectile.getCurrentX() >= ship.getLeftBoundry() &&
	    projectile.getCurrentX() <= ship.getRightBoundry()));
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

	function StageManagerFactory() {
	  this.create = function(canvasId, enemyShipCount) {
	    return new StageManager(canvasId, enemyShipCount);
	  };
	}

	module.exports = new StageManagerFactory();


/***/ }
/******/ ]);