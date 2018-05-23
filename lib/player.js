class Player {
  constructor(x, y, context) {
    this.x = x;
    this.y = y;
    this.height = 20;
    this.width = 20;
    this.color = 'white';
    this.context = context;
  }

  update() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
