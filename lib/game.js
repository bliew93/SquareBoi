document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("squareboi-game");
  canvas.width = 500;
  canvas.height = 500;

  const context = canvas.getContext("2d");
  context.fillStyle = 'green';
  context.fillRect(0, 0, 500, 500);
});
