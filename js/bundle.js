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
	  var game = Game.create("game-canvas");
	  game.init();
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Spaceship = __webpack_require__(2);
	var AssetManager = __webpack_require__(6);

	function Game(canvasId) {

	  this.stage = new createjs.Stage(canvasId);

	  this.enemyAttackFrequency = 90;
	  this.frameCount = 0;

	  this.isPaused = false;
	  this.assetManager = AssetManager.create();


	  this.init = function() {

	    this.assetManager.init(this.stage, 12);
	    // add listeners
	    this.stage.addEventListener("click", this._fire.bind(this));

	    this._configureTicker();

	  };

	  this.tick = function() {
	    if (!this.isPaused) {

	      // update player position
	      this._updatePlayerLocation();
	      // update enemy ship locations
	      this.assetManager.moveEnemyShips();
	      // npc fire
	      this._handleEnemyAttacks();
	      // update projectile locations
	      this.assetManager.moveProjectiles();
	      // check for collisions
	      this.assetManager.handleProjectileCollisions(this.stage);
	      // update explosions
	      this.assetManager.updateExplosions();

	      // remove expired assets from stage
	      this.assetManager.removeDestroyedShips(this.stage);
	      this.assetManager.removeExpiredProjectiles(this.stage);
	      this.assetManager.removeExpiredExplosions(this.stage);

	      this.stage.update();
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
	    if (!this.isPaused && this.stage.mouseInBounds) {
	      this.assetManager.firePlayer1(this.stage);
	    }
	  };

	  this._updatePlayerLocation = function() {
	    if (this.stage.mouseInBounds) {
	      this.assetManager.movePlayerShip(this.stage.mouseX, this.stage.mouseY);
	    }
	  };

	  this._handleEnemyAttacks = function() {
	    this.frameCount = this.frameCount + 1;
	    if (this.frameCount >= this.enemyAttackFrequency) {
	      this.frameCount = 0;
	      this.assetManager.fireEnemyShip(this.stage);
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

	function SpaceShip(imagePath) {

	  // game attributes
	  this.health = 100;

	  // visual attributes
	  this.spriteSheet = new createjs.SpriteSheet({
	    images: [imagePath],
	    frames: {width:100, height:100, regX: 50, regY: 50},
	    animations: {
	      default: {
	        frames: [0, 1],
	        speed: 0.1
	      },
	      damaged: {
	        frames: [2, 3],
	        speed: 0.1
	      }
	    }
	  });
	  this.sprite = new createjs.Sprite(this.spriteSheet, "default");
	  this.radius = 50;

	  this.getSelf = function() {
	    return this.sprite;
	  };

	  this.moveSpaces = function(x, y) {
	    this.sprite.x = this.sprite.x + x;
	    this.sprite.y = this.sprite.y + y;
	  };

	  this.collidesWithCoordinates = function(x, y) {
	    return (this.isWithinXBoundaries(x) && this.isWithinYBoundaries(y));
	  };

	  this.isWithinYBoundaries = function(yValue) {
	    return (yValue >= this.getTopBoundry() && yValue <= this.getBottomBoundry());
	  };

	  this.isWithinXBoundaries = function(xValue) {
	    return (xValue >= this.getLeftBoundry() && xValue <= this.getRightBoundry());
	  };

	  this.getCurrentX = function() {
	    return this.sprite.x;
	  };

	  this.getCurrentY = function() {
	    return this.sprite.y;
	  };

	  this.getLeftBoundry = function() {
	    return (this.sprite.x - this.radius);
	  };

	  this.getRightBoundry = function() {
	    return (this.sprite.x + this.radius);
	  };

	  this.getTopBoundry = function() {
	    return (this.sprite.y - this.radius);
	  };

	  this.getBottomBoundry = function() {
	    return (this.sprite.y + this.radius);
	  };

	  this.moveToX = function (x) {
	    this.sprite.x = x;
	  };

	  this.moveToY = function (y) {
	    this.sprite.y = y;
	  };

	  this.fire = function() {
	    var laser = Laser.create(this.getCurrentX(), this.getCurrentY() - this.radius);
	    laser.draw();
	    return laser;
	  };

	  this.takeDamage = function(amount) {
	    this.health = this.health - amount;
	    if (this.health < 50) {
	      this.sprite.gotoAndPlay("damaged");
	    }
	  };
	}

	function SpaceShipFactory() {

	  this.create = function(image) {
	    return new SpaceShip(image);
	  };

	}

	module.exports = new SpaceShipFactory();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Explosion = __webpack_require__(4);

	function Laser(startingX, startingY) {

	  this.damage = 20;

	  this.rectangle = new createjs.Shape();
	  this.startingX = startingX;
	  this.startingY = startingY;
	  this.height = 12;
	  this.width = 6;
	  this.speed = 5;
	  this.isFriendly = true;
	  this.isExpired = false;

	  this.draw = function() {
	    this.rectangle.graphics.beginFill("yellow").drawRect(this.startingX, this.startingY, this.width, this.height);
	  };

	  this.getSelf = function() {
	    return this.rectangle;
	  };

	  this.move = function() {
	    if (this.isFriendly)
	      this.rectangle.y = this.rectangle.y - this.speed;
	    else
	      this.rectangle.y = this.rectangle.y + this.speed;
	  };

	  this.getTopBoundry = function() {
	    // PLUS OR MINUS?
	    return (this.rectangle.y + this.startingY - (this.height / 2));
	  };

	  this.getBottomBoundry = function() {
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
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Spaceship = __webpack_require__(2);

	function AssetManager() {

	  this.height = null;
	  this.width = null;

	  this.backgroundImage1 = new createjs.Bitmap("/demo-game/img/space-background.png");
	  this.backgroundImage2 = new createjs.Bitmap("/demo-game/img/space-background.png");


	  this.player1 = Spaceship.create("/demo-game/img/spaceship.png");
	  this.projectiles = [];
	  this.explosions = [];
	  this.enemyShips = [];

	  this.init = function(stage, enemyShipCount) {
	    this.height = stage.canvas.height;
	    this.width = stage.canvas.width;
	    this._setupAssets(enemyShipCount);
	    this._addAssetsToStage(stage);
	  };

	  /** PLAYER CONTROLS **/
	  this.firePlayer1 = function(stage) {
	    var laser = this.player1.fire();
	    this.projectiles.push(laser);
	    stage.addChild(laser.getSelf());
	  };

	  this.movePlayerShip = function(x, y) {
	    // hiding this here for now, if you think about the ship's location relative to space, this makes sense anyway! lol
	    this._moveBackground();
	    this.player1.moveToX(x);
	    this.player1.moveToY(y);
	  };

	  /** UPDATE METHODS **/

	  this.moveEnemyShips = function() {
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      if (this.enemyShips[i].getCurrentY() < 100) {
	        if (this.enemyShips[i].getLeftBoundry() >= this.width) {
	          this.enemyShips[i].moveToX(0 - this.enemyShips[i].radius);
	        }
	        this.enemyShips[i].moveSpaces(1, 0);
	      } else {
	        if (this.enemyShips[i].getRightBoundry() <= 0) {
	          this.enemyShips[i].moveToX(this.width + this.enemyShips[i].radius);
	        }
	        this.enemyShips[i].moveSpaces(-1, 0);
	      }
	    }
	  };

	  this.fireEnemyShip = function(stage) {
	    var randomIndex = this._getRandomIndex(this.enemyShips.length - 1, 0);
	    console.log(randomIndex);
	    var projectile = this.enemyShips[randomIndex].fire();
	    projectile.isFriendly = false;
	    this.projectiles.push(projectile);
	    stage.addChild(projectile.getSelf());
	  };

	  this.moveProjectiles = function() {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      var projectile = this.projectiles[i];
	      projectile.move();
	      var xValue = projectile.getCurrentX();
	      var yValue = projectile.getCurrentY();
	      if (xValue > this.width || xValue < 0) {
	        projectile.isExpired = true;
	      } else if (yValue > this.height || yValue < 0) {
	        projectile.isExpired = true;
	      }
	    }
	  };

	  this.handleProjectileCollisions = function(stage) {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      var projectile = this.projectiles[i];
	      if (projectile.isFriendly) {
	        console.log("friendly projectile");
	        this._handleEnemyCollision(stage, projectile);
	      } else if (this.player1.collidesWithCoordinates(projectile.getCurrentX(), projectile.getCurrentY())) {
	        this._handleCollision(projectile, this.player1, stage);
	      }
	    }
	  };

	  this.updateExplosions = function() {
	    for (var i = 0; i < this.explosions.length; i++) {
	      this.explosions[i].explode();
	    }
	  };

	  /** CLEANUP METHODS **/

	  this.removeDestroyedShips = function(stage) {
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      if (this.enemyShips[i].health <= 0) {
	        stage.removeChild(this.enemyShips[i].getSelf());
	        this.enemyShips.splice(i, 1);
	      }
	    }
	  };

	  this.removeExpiredProjectiles = function(stage) {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      if (this.projectiles[i].isExpired) {
	        stage.removeChild(this.projectiles[i].getSelf());
	        this.projectiles.splice(i, 1);
	      }
	    }
	  };

	  this.removeExpiredExplosions = function(stage) {
	    for (var i = 0; i < this.explosions.length; i++) {
	      if (this.explosions[i].isExpired) {
	        stage.removeChild(this.explosions[i].getSelf());
	        this.explosions.splice(i, 1);
	      }
	    }
	  };

	  /** PRIVATE METHODS **/

	  this._setupAssets = function(enemyShipCount) {
	    this.backgroundImage2.y = -this.height;
	    this.player1.moveToX(this.width/2);
	    this.player1.moveToY(this.height-100);
	    this._createEnemyShips(enemyShipCount);
	  };

	  this._addAssetsToStage = function(stage) {
	    stage.addChild(this.backgroundImage1);
	    stage.addChild(this.backgroundImage2);
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      stage.addChild(this.enemyShips[i].getSelf());
	    }
	    stage.addChild(this.player1.getSelf());
	  };

	  this._createEnemyShips = function(enemyShipCount) {
	    // this logic is ideal for up to 12 ships on an 800 px wide canvas, I'm defering
	    // making this more dynamic since this is a proof of concept
	    var startingX = 50;
	    var startingY = 60;
	    for (var i = 0; i < enemyShipCount; i++) {
	      var enemyShip = Spaceship.create("/demo-game/img/enemy-spaceship.png");
	      enemyShip.moveToX(startingX);
	      enemyShip.moveToY(startingY);
	      this.enemyShips.push(enemyShip);
	      startingX = startingX + 75;
	      if (startingY > 100) {
	        startingY = startingY - 110;
	      } else {
	        startingY = startingY + 110;
	      }
	    }
	  };

	  this._getRandomIndex = function(max, min) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	  };

	  this._moveBackground = function() {
	    if (this.backgroundImage1.y > this.height) {
	      this.backgroundImage1.y = -this.height;
	    }
	    if (this.backgroundImage2.y > this.height) {
	      this.backgroundImage2.y = -this.height;
	    }
	    this.backgroundImage1.y = this.backgroundImage1.y + 0.5;
	    this.backgroundImage2.y = this.backgroundImage2.y + 0.5;
	  };

	  this._handleEnemyCollision = function(stage, projectile) {
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      var enemyShip = this.enemyShips[i];
	      if (enemyShip.collidesWithCoordinates(projectile.getCurrentX(), projectile.getCurrentY())) {
	        console.log("collides with enemy ship");
	        this._handleCollision(projectile, enemyShip, stage);
	        // want to avoid colliding with multiple ships for now
	        break;
	      }
	    }
	  };

	  this._handleCollision = function(projectile, ship, stage) {
	    ship.takeDamage(projectile.damage);
	    var explosion = projectile.explode();
	    stage.addChild(explosion.getSelf());
	    this.explosions.push(explosion);
	  };
	}

	function AssetManagerFactory() {
	  this.create = function() {
	    return new AssetManager();
	  };
	}

	module.exports = new AssetManagerFactory();


/***/ }
/******/ ]);