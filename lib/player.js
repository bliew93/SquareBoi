class Player {
  constructor(x, y) {
    const canvas = document.getElementById("squareboi-game");

    this.x = x;
    this.y = y;
    this.height = 20;
    this.width = 20;
    this.speed = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = 'red';
    this.jumping = false;
    this.context = canvas.getContext("2d");
  }

  update() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
