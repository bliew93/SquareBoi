import SquareBoi from './player.js';
import Game from './game.js';

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

  const squareBoiGame = new Game();
  const squareBoi = new SquareBoi(canvas.width / 2, canvas.height - 25);
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
