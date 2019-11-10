import * as utils from './utils';

let g; // ga instance
let s; // game state

let BLOCK_H,
  BLOCK_W,
  CANVAS_H,
  TREASURE_H,
  TREASURE_W,
  TREASURE_BLOCK_OFFSET,
  NUM_COLS,
  NUM_ROWS,
  fixedBlocksMap,
  healthBar;

const ensureGlobals = () => {
    g = window.g;
    s = window.s;

    BLOCK_H = s.BLOCK_H;
    BLOCK_W = s.BLOCK_W;
    CANVAS_H = s.CANVAS_H;
    TREASURE_H = s.TREASURE_H;
    TREASURE_W = s.TREASURE_W;
    TREASURE_BLOCK_OFFSET = s.TREASURE_BLOCK_OFFSET;
    NUM_COLS = s.NUM_COLS;
    NUM_ROWS = s.NUM_ROWS;
    fixedBlocksMap = s.fixedBlocksMap;
    healthBar = s.healthBar;
}


let shouldCreateNew = false;

export function init() {
  ensureGlobals();
}

export function create(scene, col) {
  // treasure = yellow rect
  let item = g.rectangle(TREASURE_W, TREASURE_H, 'yellow');
  if (col === undefined)
    col = g.randomInt(0, NUM_COLS - 1);
  item.x = (BLOCK_W * col) + TREASURE_BLOCK_OFFSET;
  // y-pos on top of highest block in this col
  let row;
  for (row = NUM_ROWS - 1; row >= 0; row = row - 1) {
    if (fixedBlocksMap[row][col] === 0) {
        console.log(`treasure: empty row ${row} for col ${col}`)
        item.y = CANVAS_H - ((NUM_ROWS-1-row) * BLOCK_H) - TREASURE_H;
        break;
    }
  }

  scene.addChild(item);
  console.log(`created treasure at col,row ${col},${row} - x,y ${item.x},${item.y}`)
  return item;
}

export function createNewIfNeeded(treasures, scene) {
  if (shouldCreateNew) {
    shouldCreateNew = false;
    const it = create(scene);
    treasures.push(it);
  }
}

export function checkCollisions(treasures, stoppedEnemies, player, scene) {
  let playerHit = false,
    treasureSquashed = false,
    indexesPickedUp = [];

  treasures.forEach((treasure, inx) => {
    if (g.hitTestRectangle(player, treasure)) {
      playerHit = true;
      indexesPickedUp.push(inx);
    }

    // check if treasure hits stopped block (squashed)
    stoppedEnemies.forEach(block => {
      if (g.hitTestRectangle(treasure, block)) {
        treasureSquashed = true;
        indexesPickedUp.push(inx);
      }
    });
  });

  indexesPickedUp.forEach(inx => {
    if (playerHit) {
        console.log('Picked up treasure!')
        healthBar.score += 100;
    }
    else {
        console.log('Treasure squashed!')
    }
    scene.removeChild(treasures[inx]);
    treasures.splice(inx, 1);
    shouldCreateNew = true;
  });

  return {playerHit};
}
