# SquareBoi
## A platformer guiding our Square Boi through a series of levels

### Background
SquareBoi is a 2D puzzle platformer where a player controls our boi, navigating past the pitfalls of each level in order to reach the end. The player can jump past a series of obstacles to reach an end point in which they will be brought to the next level. The game will end once the player completes all levels.

### Functionality & MVP
With SquareBoi, users will be able to:
- [ ] Start, pause, and reset the game
- [ ] Navigate through a series of levels as our boi via jumping and running

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production README

### Architecture and Technologies
This project will be implemented with the following technologies:

- `JavaScript` for game logic,
- `HTML5 Canvas` to render our boi and the platform levels,
- `Webpack` to bundle js files.

In addition to the entry file, there will be three scripts involved in this project:

`game.js`: this script will handle the logic for creating and updating the necessary boi and platforms per level.

`player.js`: this script will handle the logic behind our boi including collision detection, movement, and physics.

`levels.js`: this script will have the platform coordinates that will be rendered with Canvas.

### Implementation Timeline
**Day 1**: Setup all node modules and necessary files. Learn Canvas, player rendering, movement, collision detection.
**Day 2-5**: Work on implementing the above.

### Bonus features
There are many directions this project could eventually go.  Some anticipated updates are:

- [ ] Add moving platforms or shifting platform shapes
- [ ] Add improved player physics
