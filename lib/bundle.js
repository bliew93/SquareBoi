/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__levels_js__ = __webpack_require__(3);




(function() {
    var requestAnimationFrame = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame
    );
    window.requestAnimationFrame = requestAnimationFrame;
})();

// World Properties
var mapSize = {tw: 56, th: 31.5};
var tileSize = 16;
var unitLength = tileSize;
var friction = 0.8;
var gravity = 0.3;
var acceleration = 1.2;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = mapSize.tw * tileSize;
  canvas.height = mapSize.th * tileSize;

  const squareBoi = new __WEBPACK_IMPORTED_MODULE_0__player_js__["a" /* default */](25, canvas.height - 25);
  const squareBoiGame = new __WEBPACK_IMPORTED_MODULE_1__game_js__["a" /* default */](mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  const levelOne = __WEBPACK_IMPORTED_MODULE_2__levels_js__["a" /* default */][0]; // for now. will have level counter and a bunch of levels maybe
  let keys = [];

  document.body.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
  });

  const update = () => {
    if ((keys[38] || keys[32]) || keys[87] && !squareBoi.jumping) { // up arrow
      squareBoi.jumping = true;
      squareBoi.onGround = false;
      squareBoi.velocityY = -squareBoi.speed * 2.5;
    }
    if (keys[37] || keys[65] && Math.abs(squareBoi.velocityX) < squareBoi.maxVelocityX) { // left arrow
      squareBoi.velocityX--;
    }
    if (keys[39] || keys[68 ]&& squareBoi.velocityX < squareBoi.maxVelocityX) { //right arrow
      squareBoi.velocityX++;
    }

    squareBoi.velocityX *= friction;
    squareBoi.velocityY += gravity;

    context.clearRect(0, 0, canvas.width, canvas.height);
    squareBoi.update();

    squareBoiGame.drawLevel(levelOne);

    if(squareBoi.onGround) {
      squareBoi.velocityY = 0;
    }

    squareBoi.x += squareBoi.velocityX;
    squareBoi.y += squareBoi.velocityY;

    requestAnimationFrame(update);
  };

  update();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {
  constructor(x, y) {
    const canvas = document.getElementById("squareboi-game");

    this.x = x;
    this.y = y;
    this.height = 16;
    this.width = 16;
    this.speed = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxVelocityX = this.speed * 3;
    this.maxVelocityY = this.speed * 3;
    this.color = 'red';
    this.jumping = false;
    this.onGround = false;
    this.context = canvas.getContext("2d");
  }

  update() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Game {
  constructor(mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi) {
    this.canvas = document.getElementById("squareboi-game");
    this.context = this.canvas.getContext("2d");
    this.mapSize = mapSize;
    this.tileSize = tileSize;
    this.unitLength = unitLength;
    this.friction = friction;
    this.gravity = gravity;
    this.acceleration = acceleration;
    this.squareBoi = squareBoi;
  }

  drawLevel(level) {
        let borders = [];

        borders.push({
          x: 0,
          y: 0,
          width: 0,
          height: this.mapSize.th * this.tileSize
        });
        borders.push({
          x: 0,
          y: this.mapSize.th * this.tileSize,
          width: this.mapSize.tw * this.tileSize,
          height: 0
        });
        borders.push({
          x: this.mapSize.tw * this.tileSize,
          y: 0,
          width: 0,
          height: this.mapSize.th * this.tileSize
        });

    this.squareBoi.onGround = false;

    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level.length; j++) {
        if(level[i][j] === 1) {
          let platformX = this.mapSize.tw * this.tileSize - (i-1) * 2 * this.tileSize;
          let platformY = this.mapSize.th * this.tileSize - (j-1) * 2 * this.tileSize;
          let platformWidth = this.tileSize * 2;
          let platformHeight = this.tileSize * 2;

          this.collisionResolution(this.squareBoi, {x: platformX, y: platformY, width: platformWidth, height: platformHeight });

          this.context.fillStyle = 'black';
          this.context.fillRect(platformX, platformY, platformWidth, platformHeight);
        }
      }
    }

    for (let j = 0; j < borders.length; j++) {
      let platformX = borders[j].x;
      let platformY = borders[j].y;
      let platformWidth = borders[j].width;
      let platformHeight = borders[j].height;

      this.collisionResolution(this.squareBoi, {x: platformX, y: platformY, width: platformWidth, height: platformHeight });

      this.context.fillStyle = 'black';
      this.context.fillRect(platformX, platformY, platformWidth, platformHeight);
    }
  }

  collisionCheck(objA, objB) {
    const vX = (objA.x + (objA.width / 2)) - (objB.x + (objB.width / 2));
    const vY = (objA.y + (objA.height / 2)) - (objB.y + (objB.height / 2));
    const hWidths = (objA.width / 2) + (objB.width / 2);
    const hHeights = (objA.height / 2) + (objB.height / 2);
    const oX = hWidths - Math.abs(vX);
    const oY = hHeights - Math.abs(vY);
    let colDir = null;

    if((Math.abs(vX) < hWidths) && (Math.abs(vY) < hHeights)) {
      if (oX >= oY) {
        if(vY > 0) {
          colDir = 't';
          objA.y += oY;
        }
        else {
          colDir = 'b';
          objA.y -= oY;
        }
    }
      else {
        if (vX > 0) {
          colDir = "l";
          objA.x += oX;
        }
        else {
          colDir = "r";
          objA.x -= oX;
        }
      }
    }
    return colDir;
  }

  collisionResolution(objA, objB) {
    let dir = this.collisionCheck(objA, objB);

    if (dir === "l" || dir === "r") {
      this.squareBoi.velocityX = 0;
      this.squareBoi.jumping = false;
    }
    else if (dir === "b") {
      this.squareBoi.onGround = true;
      this.squareBoi.jumping = false;
    }
    else if (dir === "t") {
      this.squareBoi.velocityY *= -1;
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = {
  0: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
  ]
};

/* harmony default export */ __webpack_exports__["a"] = (levels);


/***/ })
/******/ ]);