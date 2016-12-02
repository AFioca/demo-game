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

	$( document ).ready(function() {
	  // create game
	  var game = Game.create();
	  game.init("game-canvas");

	  var projectileChoices = game.getAvailableProjectiles();
	  var choicesDiv = $('#projectiles');
	  for (var i = 0; i < projectileChoices.length; i++) {
	    if (projectileChoices[i].name === "laser") {
	      choicesDiv.append("<li><input type='radio' name='projectiles' checked value='" + projectileChoices[i].name + "' /> " + projectileChoices[i].name + "</li>");
	    } else {
	      choicesDiv.append("<li><input type='radio' name='projectiles' value='" + projectileChoices[i].name + "' /> " + projectileChoices[i].name + "</li>");
	    }
	  }

	  // add control listeners
	  $("#pause").click(function() {
	    game.togglePause();
	  });

	  $("#reset").click(function() {
	    game.noOfEnemies = $("#number-enemies").val();
	    game.enemyAttackFrequency = $("#attack-speed").val();
	    console.log(game.noOfEnemies);
	    game.reset();
	  });

	  $('input[name=projectiles]').click(function() {
	    game.switchProjectile(this.value);
	  });

	  $( document ).keydown(function(event) {

	    switch (event.keyCode) {
	      case 37:
	        event.preventDefault();
	        game.moveLeft();
	        break;
	      case 38:
	        event.preventDefault();
	        game.moveUp();
	        break;
	      case 39:
	        event.preventDefault();
	        game.moveRight();
	        break;
	      case 40:
	        event.preventDefault();
	        game.moveDown();
	        break;
	      case 32:
	        event.preventDefault();
	        game.fire();
	        break;
	    }
	  });

	  $( document ).keyup(function(event) {
	    if (event.keyCode != 32) {
	      game.clearMove();
	    }
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var AssetManager = __webpack_require__(2);

	function Game() {

	  this.isPaused = false;
	  this.stage = null;

	  this.assetManager = AssetManager.create();

	  // create config object?
	  this.noOfEnemies = 6;
	  this.enemyAttackFrequency = 90;

	  this.init = function(gameCanvasId) {
	    this.stage = new createjs.Stage(gameCanvasId);
	    this.assetManager.init(this.stage, this.noOfEnemies, this.enemyAttackFrequency);
	    this._configureTicker();
	  };

	  this.tick = function() {
	    if (!this.isPaused) {
	      this.assetManager.updateAssets();
	      if (this.move) {
	        this.assetManager.player1.move(this.move);
	      }
	    }
	    this.stage.update();
	  };

	  this.togglePause = function() {
	    this.isPaused = !this.isPaused;
	  };

	  this.getAvailableProjectiles = function() {
	    return this.assetManager.player1.weaponsSystem.getAvailableProjectiles();
	  };

	  this.switchProjectile = function(type) {
	    this.assetManager.player1.switchWeapon(type);
	  };

	  this.reset = function() {
	    this.isPaused = true;
	    this.stage.clear();
	    this.stage.removeAllChildren();
	    this.assetManager = AssetManager.create();
	    this.assetManager.init(this.stage, this.noOfEnemies, this.enemyAttackFrequency);
	    this.isPaused = false;
	  };

	  this.moveUp = function() {
	    this.move = "up";
	  };

	  this.moveRight = function() {
	    this.move = "right";
	  };

	  this.moveDown = function() {
	    this.move = "down";
	  };

	  this.moveLeft = function() {
	    this.move = "left";
	  };

	  this.clearMove = function() {
	    this.move = null;
	  };

	  this._configureTicker = function() {
	    createjs.Ticker.useRAF = true; // not sure what this does yt
	    createjs.Ticker.setFPS(60);
	    createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	  };

	  this.fire = function() {
	    if (!this.isPaused) {
	      this.assetManager.firePlayer1();
	    }
	  };

	}

	function GameFactory() {
	  this.create = function() {
	    return new Game();
	  };
	}

	module.exports = new GameFactory();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var NumberUtility = __webpack_require__(3);
	var ShipFactory = __webpack_require__(4);
	var TrafficController = __webpack_require__(9);

	function AssetManager() {

	  this.stage = null;
	  this.height = null;
	  this.width = null;

	  this.backgroundImage1 = new createjs.Bitmap("/demo-game/img/space-background.png");
	  this.backgroundImage2 = new createjs.Bitmap("/demo-game/img/space-background.png");

	  this.player1 = ShipFactory.createPlayerShip();
	  this.projectiles = [];
	  this.explosions = [];
	  this.enemyShips = [];

	  this.enemyAttackFrequency = 90;
	  this.frameCount = 0;

	  this.init = function(stage, enemyShipCount, attackFreq) {
	    this.stage = stage;
	    this.height = stage.canvas.height;
	    this.width = stage.canvas.width;
	    this.enemyAttackFrequency = attackFreq;
	    this._setupAssets(enemyShipCount);
	    this._addAssetsToStage(stage);
	  };

	  this.firePlayer1 = function() {
	    var laser = this.player1.fire();
	    this.projectiles.push(laser);
	    this.stage.addChild(laser.getSelf());
	  };

	  this.updateAssets = function() {
	    this._moveBackground();
	    this._moveEnemyShips();
	    this._attackWithEnemyShips(this.stage);
	    this._moveProjectiles();
	    this._handleProjectileCollisions(this.stage);
	    this._updateExplosions();

	    this._removeDestroyedShips(this.stage);
	    this._removeExpiredProjectiles(this.stage);
	    this._removeExpiredExplosions(this.stage);

	    // this.stage.update();
	  };

	  this.getPlayerHealth = function() {
	    return this.player1.health;
	  };

	  /** PRIVATE METHODS **/

	  this._setupAssets = function(enemyShipCount) {
	    this.backgroundImage2.y = -this.height + 1;
	    this.player1.moveToX(this.width/2);
	    this.player1.moveToY(this.height-100);
	    this.player1.reSize(0.8);
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
	    var startingY = 80;
	    for (var i = 0; i < enemyShipCount; i++) {
	      var enemyShip = ShipFactory.createDroneShip();
	      if (startingX >= this.width + enemyShip.radius) {
	        startingX = 50;
	        startingY = startingY + 110;
	      }
	      enemyShip.moveToX(startingX);
	      enemyShip.moveToY(startingY);
	      enemyShip.reSize(0.8);
	      this.enemyShips.push(enemyShip);
	      startingX = startingX + 100;
	    }
	  };

	  this._moveEnemyShips = function() {
	    for (var n = 0; n < this.enemyShips.length; n++) {
	      var ship = this.enemyShips[n];
	      if (TrafficController.pathIsClear(ship, this.enemyShips, this.projectiles, this.height - 400, this.width)) {
	        ship.move();
	      }
	      ship.moveAttemptCompleted();
	    }
	  };

	  this._attackWithEnemyShips = function(stage) {
	    this.frameCount = this.frameCount + 1;
	    if (this.frameCount >= this.enemyAttackFrequency) {
	      this.frameCount = 0;
	      this._fireEnemyShip(stage);
	    }
	  };

	  this._moveProjectiles = function() {
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

	  this._handleProjectileCollisions = function(stage) {
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

	  this._updateExplosions = function() {
	    for (var i = 0; i < this.explosions.length; i++) {
	      this.explosions[i].explode();
	    }
	  };

	  this._removeDestroyedShips = function(stage) {
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      if (this.enemyShips[i].health <= 0) {
	        stage.removeChild(this.enemyShips[i].getSelf());
	        this.enemyShips.splice(i, 1);
	      }
	    }
	  };

	  this._removeExpiredProjectiles = function(stage) {
	    for (var i = 0; i < this.projectiles.length; i++) {
	      if (this.projectiles[i].isExpired) {
	        stage.removeChild(this.projectiles[i].getSelf());
	        this.projectiles.splice(i, 1);
	      }
	    }
	  };

	  this._removeExpiredExplosions = function(stage) {
	    for (var i = 0; i < this.explosions.length; i++) {
	      if (this.explosions[i].isExpired) {
	        stage.removeChild(this.explosions[i].getSelf());
	        this.explosions.splice(i, 1);
	      }
	    }
	  };

	  this._fireEnemyShip = function(stage) {
	    if (this.enemyShips.length > 0) {
	      var randomIndex = NumberUtility.getRandomNumberBetween(this.enemyShips.length - 1, 0);
	      var projectile = this.enemyShips[randomIndex].fire();
	      projectile.isFriendly = false;
	      this.projectiles.push(projectile);
	      stage.addChild(projectile.getSelf());
	    }
	  };

	  this._moveBackground = function() {
	    if (this.backgroundImage1.y > this.height) {
	      this.backgroundImage1.y = -this.height + 1;
	    }
	    if (this.backgroundImage2.y > this.height) {
	      this.backgroundImage2.y = -this.height + 1;
	    }
	    this.backgroundImage1.y = this.backgroundImage1.y + 0.5;
	    this.backgroundImage2.y = this.backgroundImage2.y + 0.5;
	  };

	  this._handleEnemyCollision = function(stage, projectile) {
	    for (var i = 0; i < this.enemyShips.length; i++) {
	      var enemyShip = this.enemyShips[i];
	      if (enemyShip.collidesWithCoordinates(projectile.getCurrentX(), projectile.getCurrentY())) {
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function NumberUtility() {

	  this.getRandomNumberBetween = function(min, max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	  };
	}

	var numberUtility = new NumberUtility();

	module.exports = numberUtility;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var NavigationSystem = __webpack_require__(5);
	var WeaponsSystem = __webpack_require__(6);
	var Ships = __webpack_require__(10);

	function ShipFactory() {

	  this.createPlayerShip = function() {
	    return new this.SpaceShip(Ships.PLAYER);
	  };

	  this.createDroneShip = function() {
	    return new this.SpaceShip(Ships.DRONE);
	  };

	  this.SpaceShip = function(config) {

	    this.health = config.health;
	    this.speed = config.speed;
	    this.navigationSystem = NavigationSystem.create();
	    this.weaponsSystem = WeaponsSystem.create(config.availableProjectiles);

	    this.spriteSheet = config.sprite;
	    this.sprite = new createjs.Sprite(config.spriteSheet, "default");
	    this.widthModifier = config.widthModifier;
	    this.heightModifier = config.heightModifier;

	    this.getSelf = function() {
	      return this.sprite;
	    };

	    this.move = function(dir) {
	      var direction;
	      if (dir) {
	        direction = dir;
	      } else {
	        direction = this.navigationSystem.direction;
	      }
	      if (direction === "right") {
	        this.moveRight();
	      } else if (direction === "left") {
	        this.moveLeft();
	      } else if (direction === "up") {
	        this.moveUp();
	      } else if (direction === "down") {
	        this.moveDown();
	      }
	    };

	    this.moveUp = function() {
	      this.moveSpaces(0, -this.speed);
	    };

	    this.moveRight = function() {
	      this.moveSpaces(this.speed, 0);
	    };

	    this.moveDown = function() {
	      this.moveSpaces(0, this.speed);
	    };

	    this.moveLeft = function() {
	      this.moveSpaces(-this.speed, 0);
	    };

	    this.reSize = function(size) {
	      // Default is 1, to scale down use a decimal ie. 0.8
	      this.sprite.scaleX = size;
	      this.sprite.scaleY = size;
	      this.widthModifier = this.widthModifier * Math.abs(size);
	      this.heightModifier = this.heightModifier * Math.abs(size);
	      this.sprite.regX = this.sprite.regX * Math.abs(size);
	      this.sprite.regY = this.sprite.regY * Math.abs(size);
	    };

	    this.moveAttemptCompleted = function() {
	      this.navigationSystem.incrementAttempts();
	    };

	    this.moveSpaces = function(x, y) {
	      this.sprite.x = this.sprite.x + x;
	      this.sprite.y = this.sprite.y + y;
	    };

	    this.getDirection = function() {
	      return this.navigationSystem.direction;
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
	      return (this.sprite.x - this.widthModifier);
	    };

	    this.getRightBoundry = function() {
	      return (this.sprite.x + this.widthModifier);
	    };

	    this.getTopBoundry = function() {
	      return (this.sprite.y - this.heightModifier);
	    };

	    this.getBottomBoundry = function() {
	      return (this.sprite.y + this.heightModifier);
	    };

	    this.moveToX = function (x) {
	      this.sprite.x = x;
	    };

	    this.moveToY = function (y) {
	      this.sprite.y = y;
	    };

	    this.fire = function() {
	      return this.weaponsSystem.fire(this.getCurrentX(), this.getCurrentY() - this.heightModifier);
	    };

	    this.switchWeapon = function(type) {
	      this.weaponsSystem.switchWeapon(type);
	    };

	    this.takeDamage = function(amount) {
	      this.health = this.health - amount;
	      if (this.health < 50) {
	        this.sprite.gotoAndPlay("damaged");
	      }
	    };
	  };
	}

	module.exports = new ShipFactory();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var NumberUtility = __webpack_require__(3);

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ProjectileFactory = __webpack_require__(7);

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ExplosionFactory = __webpack_require__(8);

	function ProjectileFactory() {

	  this.createProjectile = function(config, x, y) {
	    return new this.Projectile(config, x, y);
	  };

	  this.Projectile = function(config, startingX, startingY) {
	    this.shape = null;

	    this.damage = config.damage;
	    this.speed = config.speed;
	    this.color = config.color;
	    this.getShape = config.getShape;
	    this.getHeightModifier = config.getHeightModifier;

	    this.startingX = startingX;
	    this.startingY = startingY;
	    this.height = 12;
	    this.width = 6;
	    this.isFriendly = true;
	    this.isExpired = false;

	    this.draw = function() {
	      this.shape = this.getShape(this.startingX, this.startingY);
	    };

	    this.getSelf = function() {
	      return this.shape;
	    };

	    this.move = function() {
	      if (this.isFriendly)
	        this.shape.y = this.shape.y - this.speed;
	      else
	        this.shape.y = this.shape.y + this.speed;
	    };

	    this.getTopBoundry = function() {
	      // PLUS OR MINUS?
	      return (this.shape.y - this.getHeightModifier);
	    };

	    this.getBottomBoundry = function() {
	      return (this.shape.y + this.getHeightModifier);
	    };

	    this.getCurrentX = function() {
	      return (this.shape.x);
	    };

	    this.getCurrentY = function() {
	      return (this.shape.y);
	    };

	    this.explode = function() {
	      this.isExpired = true;
	      var explosion = ExplosionFactory.create(this.getCurrentX(), this.getCurrentY());
	      explosion.draw();
	      return explosion;
	    };
	  };
	}

	module.exports = new ProjectileFactory();





/***/ },
/* 8 */
/***/ function(module, exports) {

	function ExplosionFactory() {

	  this.create = function(startingX, startingY) {
	    return new this.Explosion(startingX, startingY);
	  };

	  this.Explosion = function(startingX, startingY) {

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
	}

	module.exports = new ExplosionFactory();


/***/ },
/* 9 */
/***/ function(module, exports) {

	
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
	    // I'm sure there's a cleaner way, but this works so I'm leaving it for now.
	    var direction = ship.getDirection();
	    var willCollide = false;
	    for (var n = 0; n < ships.length; n++) {
	      if (direction === "right" && (
	          ships[n].collidesWithCoordinates(ship.getRightBoundry() + 1, ship.getCurrentY()) ||
	          ships[n].collidesWithCoordinates(ship.getRightBoundry() + 1, ship.getTopBoundry()) ||
	          ships[n].collidesWithCoordinates(ship.getRightBoundry() + 1, ship.getBottomBoundry()))) {
	        willCollide = true;
	      } else if (direction === "left" && (
	                 ships[n].collidesWithCoordinates(ship.getLeftBoundry() - 1, ship.getCurrentY()) ||
	                 ships[n].collidesWithCoordinates(ship.getLeftBoundry() - 1, ship.getTopBoundry()) ||
	                 ships[n].collidesWithCoordinates(ship.getLeftBoundry() - 1, ship.getBottomBoundry()))) {
	        willCollide = true;
	      } else if (direction === "up" && (
	                 ships[n].collidesWithCoordinates(ship.getCurrentX(), ship.getTopBoundry() - 1) ||
	                 ships[n].collidesWithCoordinates(ship.getLeftBoundry(), ship.getTopBoundry() - 1) ||
	                 ships[n].collidesWithCoordinates(ship.getRightBoundry(), ship.getTopBoundry() - 1))) {
	        willCollide = true;
	      } else if (direction === "down" && (
	                 ships[n].collidesWithCoordinates(ship.getCurrentX(), ship.getBottomBoundry() + 1) ||
	                 ships[n].collidesWithCoordinates(ship.getLeftBoundry(), ship.getBottomBoundry() + 1) ||
	                 ships[n].collidesWithCoordinates(ship.getRightBoundry(), ship.getBottomBoundry() + 1))) {
	        willCollide = true;
	      }
	    }
	    return willCollide;
	  };
	}

	var trafficController = new TrafficController();
	module.exports = trafficController;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Projectiles = __webpack_require__(11);

	var Ships = {
	  PLAYER: {
	    health: 100,
	    speed: 5,
	    availableProjectiles: [Projectiles.LASER, Projectiles.PLASMA, Projectiles.LIGHT],
	    spriteSheet: new createjs.SpriteSheet({
	      images: ["/demo-game/img/ship2.png"],
	      frames: {width:100, height:100, regX: 50, regY: 50},
	      animations: {
	        default: {
	          frames: [0],
	          speed: 0.1
	        },
	        damaged: {
	          frames: [0],
	          speed: 0.1
	        }
	      }
	    }),
	    widthModifier: 50,
	    heightModifier: 50
	  },
	  DRONE: {
	    health: 100,
	    speed: 3,
	    availableProjectiles: [Projectiles.LASER],
	    spriteSheet: new createjs.SpriteSheet({
	      images: ["/demo-game/img/enemy-spaceship.png"],
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
	    }),
	    widthModifier: 50,
	    heightModifier: 50
	  }
	};

	module.exports = Ships;


/***/ },
/* 11 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);