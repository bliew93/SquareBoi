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



(function() {
    var requestAnimationFrame = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame
    );
    window.requestAnimationFrame = requestAnimationFrame;
})();


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  const squareBoiGame = new __WEBPACK_IMPORTED_MODULE_1__game_js__["a" /* default */]();
  const squareBoi = new __WEBPACK_IMPORTED_MODULE_0__player_js__["a" /* default */](canvas.width / 2, canvas.height - 25);
  let keys = [];

  document.body.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
  });


  const update = () => {
    // change to switch statement
    if ((keys[38] || keys[32]) && !squareBoi.jumping) { // up arrow
      squareBoi.jumping = true;
      squareBoi.velocityY = -squareBoi.speed * 3;
    }
    if (keys[37] && squareBoi.velocityX > -squareBoi.speed) { // left arrow
      squareBoi.velocityX--;
    }
    if (keys[39] && squareBoi.velocityX < squareBoi.speed) { //right arrow
      squareBoi.velocityX++;
    }
    const friction = 0.6;
    const gravity = 0.3;

    squareBoi.velocityX *= friction;
    squareBoi.velocityY += gravity;

    squareBoi.x += squareBoi.velocityX;
    squareBoi.y += squareBoi.velocityY;

    if(squareBoi.x >= canvas.width - squareBoi.width) {
      squareBoi.x = canvas.width - squareBoi.width;
    }
    else if (squareBoi.x <= 0) {
      squareBoi.x = 0;
    }

    if(squareBoi.y >= canvas.height - squareBoi.height) {
      squareBoi.y = canvas.height - squareBoi.height;
      squareBoi.jumping = false;
    }
    else if (squareBoi.y <= 0) {
      squareBoi.y = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    squareBoi.update();
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
    this.height = 20;
    this.width = 20;
    this.speed = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = 'red';
    this.jumping = false;
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
  constructor() {
    this.canvas = document.getElementById("squareboi-game");
    this.context = this.canvas.getContext("2d");
  }

  render() {
    requestAnimationFrame(render);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ })
/******/ ]);