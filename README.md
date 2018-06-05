# SquareBoi
## A platformer guiding our Square Boi through a series of levels

[Live](http://brianliew.com/SquareBoi/)
![](./assets/gifs/demo.gif)

### Background
SquareBoi is a 2D puzzle platformer where a player controls our boi, navigating past a set of unique levels in order to collect his precious coins. To gather his coins, our boi will need to climb walls and bounce from platform to platform in order to progress to the next level.

### Controls
* W: Jump
* A: Move Left
* D: Move Right
* R: Restart Level

### Functionality & How to play
* Collect the yellow coins to advance to the next level
* Climb walls by holding the Jump key and the direction against the wall
* Fall from the top of the screen onto the floor and see what happens!
* If you fall off the screen, don't panic! Just press the 'R' key!
* Get a high score and save it for others to envy

### Architecture and Technologies
This project will be implemented with the following technologies:

- `JavaScript` for game logic,
- `HTML5 Canvas` to render our boi and the platform levels,
- `Webpack` to bundle js files.
- `Firebase` to persist high scores to Firebase NoSQL cloud database.


### Future Implementations
There are additional features that I would like to implement for Square Boi.
- [ ] Add moving platforms or shifting platform shapes
- [ ] Add improved player physics
- [ ] Additional levels

### High Score Snippets

#### Get High Scores from database
````js
const retrieveHighScores = () => {
  firebaseDB.ref('/scores/').once('value').then( snap => {
    highScores = snap.val();
    displayHighScores(highScores);
  });
};
````

#### Display high scores
````js
const displayHighScores = (highScores) => {
  const scoresTable = document.getElementById('scores-table');

  if(scoresTable.childElementCount > 0) {
    while(scoresTable.hasChildNodes()) { scoresTable.removeChild(scoresTable.lastChild); }
  }

  const scores = Object.keys(highScores)
    .map(el => parseInt(el))
    .sort((a,b) => a - b);
  let row, usernameCell, scoreCell;

  for (var i = 0; i < scores.length; i++) {
    row = scoresTable.insertRow(i);
    usernameCell = row.insertCell(0);
    scoreCell = row.insertCell(1);

    usernameCell.innerHTML = highScores[scores[i]];
    scoreCell.innerHTML = scores[i] / 1000;
  }
};
````

#### Write high score to database
````js
const writeScore = (username, score) => {
  const scoreRefs = firebaseDB.ref('scores/' + `${score * 1000}`);
  scoreRefs.set(username);
};
````

#### Remove lowest score in database
````js
const removeLowestScore = () => {
  firebaseDB.ref('/scores/').once('value').then( snap => {
    highScores = snap.val();
    const scores = Object.keys(highScores)
      .map(el => parseInt(el))
      .sort((a,b) => a - b);
    const lowestScore = scores[scores.length - 1].toString();
    const scoreRefs = firebaseDB.ref('scores/' + lowestScore);

    scoreRefs.remove().then( retrieveHighScores() );
  });
};
````
