import SquareBoi from './player.js';
import Game from './game.js';
import Levels from './levels.js';
import * as firebase from 'firebase/app';
import { merge } from 'lodash';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyCEppeHF1lnm_ZLt00I8Ry_ihtar3O5utQ",
    authDomain: "squareboi-62f18.firebaseapp.com",
    databaseURL: "https://squareboi-62f18.firebaseio.com",
    projectId: "squareboi-62f18",
    storageBucket: "squareboi-62f18.appspot.com",
    messagingSenderId: "995784189808"
  };

firebase.initializeApp(config);
var firebaseDB = firebase.database();

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

  let keys = [];
  let highScores;
  const squareBoi = new SquareBoi(25, canvas.height - 65);
  const squareBoiGame = new Game(mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  let levels = merge({}, Levels);
  let currentLevel = 0;
  let welcomeLevelText = `Welcome to level ${currentLevel}`;
  let initialLevelState = deepDupArray(levels[currentLevel]);
  let startTime = Date.now();

  let numCoinsInLevel = levels[currentLevel].reduce((numCoins, row) => {
    return numCoins += row.filter(el => el === 'c').length;
  }, 0);

  let levelMessage = squareBoiGame.drawLevelMessages(currentLevel);
  prevWelcomeMsgInterval = window.setInterval( () => {
    welcomeLevelText = '';
  }, 750);

  prevLevelMsgInterval = window.setInterval( () => {
    levelMessage = '';
  }, 3000);

  const restartLevel = () => {
    squareBoiGame.gameOver = false;
    levels[currentLevel] = deepDupArray(initialLevelState);

    squareBoiGame.coinCounter = 0;
    [squareBoi.x, squareBoi.y, squareBoi.velocityX, squareBoi.velocityY] = [25, canvas.height - 45, 0, 0];
  };

  const timer = () => {
    return (Date.now() - startTime) / 1000;
  };

  const removeLowestScore = () => {
    firebaseDB.ref('/scores/').once('value').then( snap => {
      highScores = snap.val();
      const scores = Object.keys(highScores)
        .map(el => parseInt(el))
        .sort((a,b) => a - b);
      const lowestScore = scores[scores.length - 1].toString();
      const scoreRefs = firebaseDB.ref('scores/' + lowestScore);

      scoreRefs.remove().then( retrieveHighScores() );
    });
  };

  const writeScore = (username, score) => {
    const scoreRefs = firebaseDB.ref('scores/' + `${score * 1000}`);
    scoreRefs.set(username);
  };

  const displayHighScores = (highScores) => {
    const scoresTable = document.getElementById('scores-table');

    if(scoresTable.childElementCount > 0) {
      while(scoresTable.hasChildNodes()) { scoresTable.removeChild(scoresTable.lastChild); }
    }

    const scores = Object.keys(highScores)
      .map(el => parseInt(el))
      .sort((a,b) => a - b);
    let row, usernameCell, scoreCell;

    for (var i = 0; i < scores.length; i++) {
      row = scoresTable.insertRow(i);
      usernameCell = row.insertCell(0);
      scoreCell = row.insertCell(1);

      usernameCell.innerHTML = highScores[scores[i]];
      scoreCell.innerHTML = scores[i] / 1000;
    }
  };

  const retrieveHighScores = () => {
    firebaseDB.ref('/scores/').once('value').then( snap => {
      highScores = snap.val();
      displayHighScores(highScores);
    });
  };

  retrieveHighScores();

  const update = () => {
    if(keys[82]) { restartLevel(); }
    if(keys[11]) {doNothing(); }
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
      const finalTime = timer();
      const modal = document.getElementById('game-over-modal');

      const stopPlaying = (e) => {
        const keyN = 78;
        if(e.keyCode === keyN) {
          e.currentTarget.removeEventListener(e.type, stopPlaying);
          const modal = document.getElementById('game-over-modal');
          modal.style.display = 'none';
        }
      };

      const playAgain = (e) => {
        const keyR = 89;
        if(e.keyCode === keyR) {
          e.currentTarget.removeEventListener(e.type, playAgain);
          const modal = document.getElementById('game-over-modal');
          modal.style.display = 'none';
          restartLevel();
          update();
        }
      };

      document.body.addEventListener("keydown", playAgain);
      document.body.addEventListener("keydown", stopPlaying);

      if(currentLevel > Object.keys(levels).length - 1) {
        context.fillStyle = 'yellow';
        context.fillText('Congratulations!!! You win!', canvas.width / 4, 40);

        document.body.removeEventListener("keydown", playAgain);
        document.body.removeEventListener("keydown", stopPlaying);

        const scoreTableTds = document.getElementsByTagName('td');
        const lowestScore = Number(scoreTableTds[scoreTableTds.length - 1].innerHTML);
        const numHighScores = document.getElementById('scores-table').lastChild.childElementCount;

        if(finalTime < lowestScore) {
          let username = '';
          const input = document.createElement('input');
          const submitBtn = document.createElement('button');

          input.setAttribute('type', 'text');
          input.addEventListener('change', (e) => {
            username = e.currentTarget.value;
          });

          submitBtn.innerHTML = 'Submit Score';
          submitBtn.addEventListener('click', (e) => {
            writeScore(username, finalTime);
            if(numHighScores >= 10) {
              removeLowestScore();
            }
            else {
              retrieveHighScores();
            }

            modal.removeChild(submitBtn);
            modal.removeChild(input);

            const thanks = document.createElement('p');
            thanks.innerHTML = "Thanks for playing!";
            modal.appendChild(thanks);
          });

          modal.appendChild(input);
          modal.appendChild(submitBtn);
        }

        currentLevel = 0;
        levels = merge({}, Levels);
        initialLevelState = deepDupArray(levels[currentLevel]);
        startTime = Date.now();
      }
      else {
        context.fillStyle = 'yellow';
        context.fillText('Game Over!', canvas.width / 2 - 80, 40);
      }

      modal.style.display = 'block';
    }
    else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      squareBoi.update(canvas, context, keys, friction, gravity);

      squareBoiGame.drawLevel(levels[currentLevel]);
      squareBoiGame.drawBorders();

      context.font = '24px VT323';
      context.fillStyle = 'gray';
      context.fillText(`${timer()}`, 20, 30);

      context.font = '38px VT323';
      context.fillStyle = 'yellow';
      context.fillText(`${squareBoiGame.coinCounter}/${numCoinsInLevel}`, canvas.width - 60, 35);
      context.fillText(welcomeLevelText, canvas.width / 3, 30);
      context.save();

      context.font = '24px VT323';
      context.shadowColor = 'black';
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowBlur = 15;
      context.fillStyle = 'white';
      context.fillText(levelMessage, 50, 70);
      context.restore();

      requestAnimationFrame(update);
    }
  };

  update();
});
