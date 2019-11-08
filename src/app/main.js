import ga from '../libs/ga';
import plugins from '../libs/plugins';
import * as _enemies from './enemies';
import * as _player from './player';
import * as _healthBar from './healthBar';
import * as utils from './utils';

const DEBUG_ENEMIES_OFF = true;

const CANVAS_H = 512,
  CANVAS_W = 512,
  PLAYER_H = 32,
  PLAYER_W = 32,
  BLOCK_H = 32,
  BLOCK_W = 32,
  NUM_BLOCK_SLOTS = Math.floor(CANVAS_W / BLOCK_W), // deprecated
  NUM_ROWS = Math.floor(CANVAS_H / BLOCK_H), // 16
  NUM_COLS = Math.floor(CANVAS_W / BLOCK_W), // 16
  fixedBlocksMap = Array(NUM_ROWS);  // will be 2d array: [NUM_ROWS][NUM_COLS]

// fixedBlocksMap holds 0 (empty) or 1 (occupied) for each
// possible block position. There are 16x16 possible
// positions (NUM_ROWS x NUM_COLS). Init to 0.
for (let i = 0; i < fixedBlocksMap.length; i++)
  fixedBlocksMap[i] = Array(NUM_COLS).fill(0);

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
  BLOCK_H,
  BLOCK_W,
  CANVAS_H,
  CANVAS_W,
  DEBUG_ENEMIES_OFF,
  end,
  fixedBlocksMap,
  maxSlotYPositions: [], // init'd by enemies.js
  message: 0,
  NUM_BLOCK_SLOTS,
  NUM_COLS,
  NUM_ROWS,
  PLAYER_H,
  PLAYER_W,
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
  s.player = player;
  _enemies.init();
  if (DEBUG_ENEMIES_OFF) {
    enemies.push(_enemies.create(gameScene, 8));
    g.wait(130, () => enemies.push(_enemies.create(gameScene, 9)));
    g.wait(260, () => enemies.push(_enemies.create(gameScene, 10)));
    g.wait(390, () => enemies.push(_enemies.create(gameScene, 7)));
    g.wait(520, () => enemies.push(_enemies.create(gameScene, 8)));
  }
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

let tempCount = 0;

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
