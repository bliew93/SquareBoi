class Game {
  constructor() {
    this.canvas = document.getElementById("squareboi-game");
    this.context = this.canvas.getContext("2d");
  }

  render() {
    requestAnimationFrame(render);
  }
}

export default Game;
