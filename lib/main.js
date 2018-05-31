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
        context.fillText('Congratulations!!! You win!', canvas.width / 4, 40);
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
