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
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level.length; j++) {
        if(level[i][j] === 1) {
          this.squareBoi.onGround = false;
          let platformX = this.mapSize.tw * this.tileSize - (i-1) * 2 * this.tileSize;
          let platformY = this.mapSize.th * this.tileSize - (j-1) * 2 * this.tileSize;
          let platformWidth = this.tileSize * 2;
          let platformHeight = this.tileSize * 2;
          var dir = this.collisionCheck(this.squareBoi, {x: platformX, y: platformY, width: platformWidth, height: platformHeight });

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

          this.context.fillStyle = 'black';
          this.context.fillRect(platformX, platformY, platformWidth, platformHeight);
        }
      }
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
}

export default Game;
