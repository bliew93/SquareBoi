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

export default Game;
