import ga from '../libs/ga';
import plugins from '../libs/plugins';
import * as _enemies from './enemies';
import * as _player from './player';
import * as _healthBar from './healthBar';

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
  CANVAS_H,
  CANVAS_W,
  end: end,
  message: 0,
};
window.g = g;
window.s = s;

//Start the Ga engine
g.start();

//Declare your global variables (global to this game)
let player,
  enemies, chimes,
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

  player = _player.create(gameScene);
  enemies = _enemies.create(1, gameScene);
  healthBar = _healthBar.create(gameScene);

  // Add some text for the game over message
  s.message = g.text("Game Over!", "64px Futura", "black", 20, 20);
  s.message.x = 120;
  s.message.y = g.canvas.height / 2 - 64;

  // Create a "gameOverScene" group and add the message sprite to it
  // (and make invisible for now)
  gameOverScene = g.group(s.message);
  gameOverScene.visible = false;

  g.fourKeyController(player, 5, 38, 39, 40, 37);

  //start game: set the game state to "play"
  g.state = play;
}

// The "play" state / game loop
function play() {
  _player.movePlayer(player);
  let {playerHit} = _enemies.moveAndCheckCollisions(enemies, player);

  _player.processPlayerHit(player, playerHit, healthBar);

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
