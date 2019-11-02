import ga from '../libs/ga';
import plugins from '../libs/plugins';
import * as _enemies from './enemies';
import * as _player from './player';
import * as _healthBar from './healthBar';
import * as utils from './utils';

const CANVAS_H = 512,
  CANVAS_W = 512;

//Create a new Ga instance, and start it.
//Pre-load images in the array.
let g = ga(
  CANVAS_W, CANVAS_H, setup,
  [
    'sounds/chimes.wav'
  ]
);

// game state (global & avail to other files)
let s = {
  BLOCK_H: 0,
  BLOCK_W: 0,
  CANVAS_H,
  CANVAS_W,
  end,
  maxSlotYPositions: [], // init'd by enemies.js
  message: 0,
  NUM_BLOCK_SLOTS: 0, // set by enemies.js
};
window.g = g;
window.s = s;

//Start the Ga engine
g.start();

//Declare your global variables (global to this game)
let player,
  enemies = [], stoppedEnemies = [],
  chimes,
  healthBar,
  gameScene, gameOverScene;

//DEAD vars
let exit, treasure;

function setup() {
  // Set the canvas border and background color
  g.canvas.style.border = '1px black dashed';
  g.backgroundColor = 'white';
  chimes = g.sound('sounds/chimes.wav');
  gameScene = g.group();

  utils.init();
  player = _player.create(gameScene);
  _enemies.init();
  // enemies = _enemies.create(1, gameScene);
  healthBar = _healthBar.create(gameScene);

  // Add some text for the game over message
  s.message = g.text("Game Over!", "64px Futura", "black", 20, 20);
  s.message.x = 120;
  s.message.y = g.canvas.height / 2 - 64;

  // Create a "gameOverScene" group and add the message sprite to it
  // (and make invisible for now)
  gameOverScene = g.group(s.message);
  gameOverScene.visible = false;

  // g.fourKeyController(player, 5, 38, 39, 40, 37);

  //start game: set the game state to "play"
  g.state = play;
}

// The "play" state / game loop
function play() {
  _player.movePlayer(player, stoppedEnemies);
  let {playerHit} = _enemies.moveAndCheckCollisions(enemies, stoppedEnemies, player);
  _enemies.createNewIfNeeded(enemies, stoppedEnemies, gameScene);

  _player.processPlayerHit(player, playerHit, healthBar);
  _enemies.checkIfReachedTop(stoppedEnemies, healthBar);

  //Check for the end of the game
  _healthBar.checkGameLost(healthBar);
}

// the "end" state
function end() {
  // hide the "gameScene" and display the "gameOverScene"
  gameScene.visible = false;
  gameOverScene.visible = true;
  g.pause();
}
