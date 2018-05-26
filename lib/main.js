import SquareBoi from './player.js';
import Game from './game.js';
import Levels from './levels.js';

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
  document.body.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
  });

  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = mapSize.tw * tileSize;
  canvas.height = mapSize.th * tileSize;

  const squareBoi = new SquareBoi(25, canvas.height - 25);
  const squareBoiGame = new Game(mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  const levels = Levels;
  let currentLevel = 0;
  let keys = [];
  let numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
    return numCoins += row.filter(el => el === 'c').length;
  }, 0);

  // SetInterval in which we say something like welcome to level x. After that, clear it (maybe with a nice
  // transition) and start the level
  // if coinCounter reaches the number of coins in the level, congraduate the player and move to next level
  // check for level number and coinCounter
  const update = () => {
    if(squareBoiGame.coinCounter === numCoinsInLevel) {
      currentLevel += 1;
      squareBoiGame.coinCounter = 0;
      [squareBoi.x, squareBoi.y] = [25, canvas.height -25];

      numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
        return numCoins += row.filter(el => el === 'c').length;
      }, 0);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '40px VT323';
    context.fillStyle = 'yellow';
    context.fillText(squareBoiGame.coinCounter, canvas.width - 25, 30);

    squareBoi.update(context, keys, friction, gravity);
    squareBoiGame.drawLevel(levels[currentLevel]);
    squareBoiGame.drawBorders();

    requestAnimationFrame(update);
  };

  update();
});
