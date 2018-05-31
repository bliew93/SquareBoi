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

const deepDupArray = (arr) => {
  let output = [];
  for (var i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      output.push(deepDupArray(arr[i]));
    }
    else {
      output.push(arr[i]);
    }
  }

  return output;
};

// World Properties
var mapSize = {tw: 56, th: 31.5};
var tileSize = 16;
var unitLength = tileSize;
var friction = 0.8;
var gravity = 0.3;
var acceleration = 1.2;
var prevWelcomeMsgInterval;
var prevLevelMsgInterval;


document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
  });

  document.getElementById('mute-audio').addEventListener("click", (e) => {
    const music = document.getElementById("music");
    if(music.muted === false) {
      music.muted = true;
      document.getElementById('mute-audio-img').src = "./assets/img/icons/music-off.png";
    }
    else {
      music.muted = false;
      document.getElementById('mute-audio-img').src = "./assets/img/icons/music-on.png";
    }
  });

  document.getElementById('game-over-yes').addEventListener("click", (e) => {
    const modal = document.getElementById('game-over-modal');
    modal.style.display = 'none';
    restartLevel();
    requestAnimationFrame(update);
  });
  document.getElementById('game-over-no').addEventListener("click", (e) => {
    const modal = document.getElementById('game-over-modal');
    modal.style.display = 'none';
  });

  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = mapSize.tw * tileSize;
  canvas.height = mapSize.th * tileSize;

  const squareBoi = new __WEBPACK_IMPORTED_MODULE_0__player_js__["a" /* default */](25, canvas.height - 65);
  const squareBoiGame = new __WEBPACK_IMPORTED_MODULE_1__game_js__["a" /* default */](mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  const levels = __WEBPACK_IMPORTED_MODULE_2__levels_js__["a" /* default */];
  let currentLevel = 0;
  let keys = [];
  let numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
    return numCoins += row.filter(el => el === 'c').length;
  }, 0);

  let welcomeLevelText = `Welcome to level ${currentLevel}`;
  let levelMessage = squareBoiGame.drawLevelMessages(currentLevel);
  prevWelcomeMsgInterval = window.setInterval( () => {
    welcomeLevelText = '';
  }, 750);

  prevLevelMsgInterval = window.setInterval( () => {
    levelMessage = '';
  }, 3000);

  let initialLevelState = deepDupArray(levels[currentLevel]);

  const restartLevel = () => {
    squareBoiGame.gameOver = false;
    levels[currentLevel] = deepDupArray(initialLevelState);

    squareBoiGame.coinCounter = 0;
    [squareBoi.x, squareBoi.y, squareBoi.velocityX, squareBoi.velocityY] = [25, canvas.height - 45, 0, 0];
  };

  const update = () => {
    if(keys[82]) { restartLevel(); }

    if(squareBoiGame.coinCounter === numCoinsInLevel) {
      currentLevel += 1;

      if(currentLevel > Object.keys(levels).length - 1) {
        squareBoiGame.gameOver = true;
      }
      else {
        initialLevelState = deepDupArray(levels[currentLevel]);
        squareBoiGame.coinCounter = 0;
        [squareBoi.x, squareBoi.y, squareBoi.velocityX, squareBoi.velocityY] = [25, canvas.height - 45, 0, 0];

        welcomeLevelText = `Welcome to level ${currentLevel}`;
        levelMessage = squareBoiGame.drawLevelMessages(currentLevel);
        context.font = '40px VT323';

        window.clearInterval(prevWelcomeMsgInterval);
        window.clearInterval(prevLevelMsgInterval);

        prevWelcomeMsgInterval = window.setInterval( () => {
          welcomeLevelText = '';
        }, 750);

        prevLevelMsgInterval = window.setInterval( () => {
          levelMessage = '';
        }, 3000);

        numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
          return numCoins += row.filter(el => el === 'c').length;
        }, 0);
      }
    }
    
    if(squareBoiGame.gameOver) {
      if(currentLevel > Object.keys(levels).length - 1) {
        context.fillStyle = 'yellow';
        context.fillText('Congratuations!!! You win!', canvas.width / 2, 40);
      }
      else {
        context.fillStyle = 'yellow';
        context.fillText('Game Over!', canvas.width / 2 - 80, 40);
      }

      let modal = document.getElementById('game-over-modal');
      modal.style.display = 'block';
    }
    else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      squareBoi.update(context, keys, friction, gravity);
      squareBoiGame.drawLevel(levels[currentLevel]);
      squareBoiGame.drawBorders();

      context.font = '24px VT323';
      context.fillStyle = 'white';
      context.fillText(levelMessage, 50, 70);

      context.font = '40px VT323';
      context.fillStyle = 'yellow';
      context.fillText(squareBoiGame.coinCounter, canvas.width - 25, 30);
      context.fillText(welcomeLevelText, canvas.width / 3, 30);

      requestAnimationFrame(update);
    }
  };

  update();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 16;
    this.width = 16;
    this.speed = 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxVelocityX = this.speed * 2;
    this.maxVelocityY = this.speed * 1.1;
    this.color = 'red';
    this.jumping = false;
    this.onGround = false;
  }

  update(context, keys, friction, gravity) {
    if (keys[87] && !this.jumping) { // up arrow
      this.jumping = true;
      this.onGround = false;
      this.velocityY = -this.speed * 2.5;
    }
    if (keys[65] && Math.abs(this.velocityX) < this.maxVelocityX) { // left arrow
      this.velocityX--;
    }
    if (keys[68]&& this.velocityX < this.maxVelocityX) { //right arrow
      this.velocityX++;
    }

    this.velocityX *= friction;
    this.velocityY += gravity;

    if(this.onGround) {
      this.velocityY = 0;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
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
    this.coinCounter = 0;
    this.gameOver = false;
  }

  drawLevel(level) {
    this.squareBoi.onGround = false;

    // platforms
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[0].length; j++) {
        if(level[i][j] === 1) {
          let platformX = j * 56;
          let platformY = i * 56;
          let platformWidth = this.tileSize * 4;
          let platformHeight = this.tileSize * 4;

          this.collisionResolution(this.squareBoi, {x: platformX, y: platformY, width: platformWidth, height: platformHeight });

          this.context.fillStyle = 'black';
          this.context.fillRect(platformX, platformY, platformWidth, platformHeight);
        }

        // coins
        else if(level[i][j] === 'c') {
          const x = j * 56 + 25;
          const y = i * 56 + 10;

          const dir = this.collisionCheck(this.squareBoi, {x, y, width: 8, height: 8 });

          if(dir) {
            level[i][j] = 0;
            this.coinCounter += 1;
          }
          else {
            this.context.fillStyle = 'yellow';
            this.context.fillRect(x, y, 8, 8);
          }
        }

        // hazard
        else if(level[i][j] === 'h') {
          const x = j * 64;
          const y = i * 59;
          const width = this.tileSize * 4;
          const height = this.tileSize * 4;
          const dir = this.collisionCheck(this.squareBoi, { x, y, width, height });

          if(dir) { this.gameOver = true; }

          this.context.fillStyle = 'orange';
          this.context.fillRect(x, y, width, height);
        }
      }
    }
  }

  drawBorders() {
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

  drawLevelMessages(currentLevel) {
    switch(currentLevel) {
      case 0:
        return 'Press "A" to move left, "D" to move right. Boi got legs!';
      case 1:
        return 'Press "W" to jump. Our boi got hops!';
      case 2:
        return 'Hold "W" and the direction against a wall. Climb dat wall boi!';
      case 3:
        return 'It\'s recess. The world\'s your jungle gym boi!';
      case 4:
        return 'Rise! And fall to the bottom. Just like a trampoline boi!';
      case 5:
        return 'Bounce like a winner. That\'s you boi!';
      case 6:
        return 'Woah, lava! Watch out boi!';
      case 7:
        return 'Bounce around the lava boi. Not through it!';
      case 8:
        return 'Show me your ninja skills boi!';
      case 9:
        return 'Last level. Just go for it boi!';

      default:
        return '';
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 'c', 0, 0, 'c', 0, 0, 0, 0, 0, 'c'],
  ],
  1: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c'],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  ],

  2: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    ['c', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 'c', 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    ['c', 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 'c', 0, 0, 0, 0, 0, 0, 0, 1, 'c', 0],
  ],

  3: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    ['c', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c'],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 'c', 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 'c', 1, 0, 0, 1, 1, 1],
  ],

  4: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 1, 0, 0, 0, 0, 'c'],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  5: [
    [0, 'c', 0, 0, 0, 0, 0, 'c', 0, 0, 0, 0, 0, 'c', 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 'c', 0, 0, 1, 0, 0, 0, 'c', 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  6: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c'],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'],
  ],

  7: [
    [0, 0, 0, 0, 0, 0, 0, 'c', 0, 0, 0, 'c', 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 'h', 0, 'h', 'h', 0, 'h', 'h', 0, 'h', 'h', 0, 'h', 'h', 0, 'h'],
  ],

  8: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 'c', 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 'c', 1, 0, 'c', 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'],
  ],

  9: [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 'h', 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 'c', 0, 0, 'h', 0, 0, 0, 0],
    [0, 0, 0, 'h', 'h', 0, 0, 'c', 1, 0, 0, 'h', 0, 0, 0, 'c'],
    [0, 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'],
  ]
};

/* harmony default export */ __webpack_exports__["a"] = (levels);


/***/ })
/******/ ]);