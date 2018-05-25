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
  const canvas = document.getElementById("squareboi-game");
  const context = canvas.getContext("2d");
  canvas.width = mapSize.tw * tileSize;
  canvas.height = mapSize.th * tileSize;

  const squareBoi = new SquareBoi(25, canvas.height - 25);
  const squareBoiGame = new Game(mapSize, tileSize, unitLength, friction, gravity, acceleration, squareBoi);
  const levelOne = Levels[0]; // for now. will have level counter and a bunch of levels maybe
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
      squareBoi.onGround = false;
      squareBoi.velocityY = -squareBoi.speed * 2.5;
    }
    if (keys[37] && Math.abs(squareBoi.velocityX) < squareBoi.maxVelocityX) { // left arrow
      squareBoi.velocityX--;
    }
    if (keys[39] && squareBoi.velocityX < squareBoi.maxVelocityX) { //right arrow
      squareBoi.velocityX++;
    }

    squareBoi.velocityX *= friction;
    squareBoi.velocityY += gravity;

    if(squareBoi.x >= canvas.width - squareBoi.width) {
      squareBoi.x = canvas.width - squareBoi.width;
    }
    else if (squareBoi.x <= 0) {
      squareBoi.x = 0;
    }
    if(squareBoi.y >= canvas.height - squareBoi.height) {
      squareBoi.y = canvas.height - squareBoi.height;
      squareBoi.jumping = false;
      squareBoi.onGround = true;
    }
    else if (squareBoi.y <= 0) {
      squareBoi.y = 0;
    }

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
