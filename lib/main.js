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

  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = mapSize.tw * tileSize;
  canvas.height = mapSize.th * tileSize;

  const squareBoi = new SquareBoi(25, canvas.height - 65);
  const squareBoiGame = new Game(mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  const levels = Levels;
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
  }, 2000);


  let initialLevelState = deepDupArray(levels[currentLevel]);

  const update = () => {
    if(keys[82]) {
      if(squareBoiGame.gameOver) { squareBoiGame.gameOver = false; }

      levels[currentLevel] = deepDupArray(initialLevelState);
      squareBoiGame.coinCounter = 0;
      [squareBoi.x, squareBoi.y, squareBoi.velocityX, squareBoi.velocityY] = [25, canvas.height - 45, 0, 0];
     }

    if(squareBoiGame.coinCounter === numCoinsInLevel) {
      currentLevel += 1;
      initialLevelState = deepDupArray(levels[currentLevel]);
      squareBoiGame.coinCounter = 0;
      [squareBoi.x, squareBoi.y, squareBoi.velocityX, squareBoi.velocityY] = [25, canvas.height - 45, 0, 0];

      if(currentLevel > Object.keys(levels).length - 1) {
        squareBoiGame.gameOver = true;
      }
      else {
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
        }, 2000);

        numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
          return numCoins += row.filter(el => el === 'c').length;
        }, 0);

      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    squareBoi.update(context, keys, friction, gravity);
    squareBoiGame.drawLevel(levels[currentLevel]);
    squareBoiGame.drawBorders();

    context.font = '24px VT323';
    context.fillStyle = 'red';
    context.fillText(levelMessage, 50, 70);

    context.font = '40px VT323';
    context.fillStyle = 'yellow';
    context.fillText(squareBoiGame.coinCounter, canvas.width - 25, 30);
    context.fillText(welcomeLevelText, canvas.width / 3, 30);

    if(squareBoiGame.gameOver) {
      context.fillStyle = 'yellow';
      context.fillText('Game Over!', canvas.width / 2 - 80, 40);
    }

    requestAnimationFrame(update);
  };

  update();
});
