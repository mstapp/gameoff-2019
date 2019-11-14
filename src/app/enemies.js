import * as utils from './utils';

let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

let BLOCK_H,
  BLOCK_W,
  NUM_COLS,
  NUM_ROWS,
  PLAYER_H,
  PLAYER_W,
  fixedBlocksMap;

const ensureGlobals = () => {
    g = window.g;
    s = window.s;

    BLOCK_H = s.BLOCK_H;
    BLOCK_W = s.BLOCK_W;
    NUM_COLS = s.NUM_COLS;
    NUM_ROWS = s.NUM_ROWS;
    PLAYER_H = s.PLAYER_H;
    PLAYER_W = s.PLAYER_W;
    fixedBlocksMap = s.fixedBlocksMap;
    s.maxSlotYPositions.length = NUM_COLS;
    s.maxSlotYPositions.fill(s.CANVAS_H);
}


//Make the enemies
let
  spacing = 48,
  xOffset = 150,
  speed = 4,
  direction = 1;

let shouldCreateNew = true;

export function init() {
  ensureGlobals();
}

export function create(scene, slot) {
  //Each enemy is a red rectangle
  let enemy = g.rectangle(BLOCK_W, BLOCK_H, 'red');
  // start at random slot position
  if (slot === undefined)
    slot = g.randomInt(0, NUM_COLS - 1);
  enemy.x = BLOCK_W * slot;
  enemy.y = 0;
  enemy.vy = speed;

  // add to game scene
  scene.addChild(enemy);

  return enemy;
}

export function createNewIfNeeded(enemies, stoppedEnemies, scene) {
  if (s.DEBUG_ENEMIES_OFF)
    return;
  if (shouldCreateNew) {
    shouldCreateNew = false;
    const e = create(scene);
    enemies.push(e);
  }
}

export function moveAndCheckCollisions(enemies, stoppedEnemies, player) {
  let playerHit = false,
    indexesAddToStopped = [];

  //Loop through all the sprites in the "enemies" array
  enemies.forEach((enemy, inx) => {
    g.move(enemy);

    if (g.hitTestRectangle(player, enemy)) {
      playerHit = true;
    }

    // Check the enemy's screen boundaries
    let enemyHitsEdges = g.contain(enemy, g.stage.localBounds);

    // check if enemy hits stopped block
    let enemyHitsBlock = false;
    stoppedEnemies.forEach((block, inx) => {
      if (g.hitTestRectangle(enemy, block)) {
        enemyHitsBlock = true;
        // move active block up to rest on top of stopped block
        enemy.y = block.y - BLOCK_H;
      }
    });

    // enemy hits existing block or bottom of stage? stop, add to stoppedEnemies
    if (enemyHitsBlock || enemyHitsEdges === "bottom") {
      enemy.vy = 0;
      indexesAddToStopped.push(inx);

      // occupy block's position in fixedBlocksMap
      const row = utils.gridRowCeil(enemy),
        col = utils.gridColCeil(enemy);
      fixedBlocksMap[row][col] = 1;
    }

    // dupe?
    // if (g.hitTestRectangle(player, enemy)) {
    //   playerHit = true;
    // }
  });

  indexesAddToStopped.forEach(inx => {
    stoppedEnemies.push(enemies[inx]);
    enemies.splice(inx, 1);
    shouldCreateNew = true;
  });

  return {playerHit};
}

export function checkIfReachedTop(stoppedEnemies, healthBar) {
  if (stoppedEnemies.some(block => block.y === 0)) {
    healthBar.inner.width = 0;
  }
}
