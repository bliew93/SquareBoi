class Player {
  constructor(x, y) {
    const canvas = document.getElementById("squareboi-game");

    this.x = x;
    this.y = y;
    this.height = 16;
    this.width = 16;
    this.speed = 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxVelocityX = this.speed * 2;
    this.maxVelocityY = this.speed * 1;
    this.color = 'red';
    this.jumping = false;
    this.onGround = false;
    this.context = canvas.getContext("2d");
  }

  update() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
