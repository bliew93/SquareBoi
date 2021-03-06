class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 16;
    this.width = 16;
    this.speed = 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxVelocityX = this.speed * 2;
    this.maxVelocityY = this.speed * 1.1;
    this.color = 'red';
    this.jumping = false;
    this.onGround = false;
  }

  update(canvas, context, keys, friction, gravity) {
    if (keys[87] && !this.jumping) { // up arrow
      this.jumping = true;
      this.onGround = false;
      this.velocityY = -this.speed * 2.5;
    }
    if (keys[65] && Math.abs(this.velocityX) < this.maxVelocityX) { // left arrow
      this.velocityX--;
    }
    if (keys[68]&& this.velocityX < this.maxVelocityX) { //right arrow
      this.velocityX++;
    }

    this.velocityX *= friction;
    this.velocityY += gravity;

    if(this.onGround) {
      this.velocityY = 0;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    if(this.x > canvas.width) {
      this.x = canvas.width - 16;
    }
    else if (this.x < 0 ) {
       this.x = -0.8;
    }

    if (this.y > canvas.height) {
      this.y = canvas.height - 24;
    }

    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
