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

    this.squareBoi.onGround = false;

    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level.length; j++) {
        if(level[i][j] === 1) {
          let platformX = this.mapSize.tw * this.tileSize - (i-1) * 2 * this.tileSize;
          let platformY = this.mapSize.th * this.tileSize - (j-1) * 2 * this.tileSize;
          let platformWidth = this.tileSize * 2;
          let platformHeight = this.tileSize * 2;

          this.collisionResolution(this.squareBoi, {x: platformX, y: platformY, width: platformWidth, height: platformHeight });

          this.context.fillStyle = 'black';
          this.context.fillRect(platformX, platformY, platformWidth, platformHeight);
        }
      }
    }

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

}

export default Game;
