
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

let NUM_BLOCK_SLOTS;
const BLOCK_H = 32,
  BLOCK_W = 32;

const ensureGlobals = () => {
    g = window.g;
    s = window.s;

    s.BLOCK_H = BLOCK_H;
    s.BLOCK_W = BLOCK_W;
    NUM_BLOCK_SLOTS = Math.floor(s.CANVAS_W / BLOCK_W);
    s.NUM_BLOCK_SLOTS = NUM_BLOCK_SLOTS;
    s.maxSlotYPositions.length = NUM_BLOCK_SLOTS;
    s.maxSlotYPositions.fill(s.CANVAS_H);
}


//Make the enemies
let //numberOfEnemies = 3,
  spacing = 48,
  xOffset = 150,
  speed = 5,
  direction = 1;

let shouldCreateNew = true;

export function init() {
  ensureGlobals();
}

function create(scene) {
  //Each enemy is a red rectangle
  let enemy = g.rectangle(BLOCK_W, BLOCK_H, 'red');
  // start at random slot position
  enemy.x = BLOCK_W * g.randomInt(0, NUM_BLOCK_SLOTS - 1);
  enemy.y = 0;
  enemy.vy = speed;

  // add to game scene
  scene.addChild(enemy);

  return enemy;
}

export function createNewIfNeeded(enemies, stoppedEnemies, scene) {
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

    // enemy hits bottom of stage? stop, add to stoppedEnemies
    if (enemyHitsEdges === "bottom" || enemyHitsBlock) {
      enemy.vy = 0;
      indexesAddToStopped.push(inx);
    }

    // for field hittest, "true" = use global coords
    if (g.hitTestRectangle(player, enemy)) {
      playerHit = true;
    }
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
