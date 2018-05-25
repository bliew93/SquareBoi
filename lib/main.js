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
    if (keys[87] && !squareBoi.jumping) { // up arrow
      squareBoi.jumping = true;
      squareBoi.onGround = false;
      squareBoi.velocityY = -squareBoi.speed * 2.5;
    }
    if (keys[65] && Math.abs(squareBoi.velocityX) < squareBoi.maxVelocityX) { // left arrow
      squareBoi.velocityX--;
    }
    if (keys[68 ]&& squareBoi.velocityX < squareBoi.maxVelocityX) { //right arrow
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
