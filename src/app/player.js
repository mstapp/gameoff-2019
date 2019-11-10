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
}

const upSpeed = 10,
  gravity = 4,
  hSpeed = 4;

export function create(scene) {
  ensureGlobals();
  let player = g.rectangle(PLAYER_W, PLAYER_H, 'blue');
  player.x = 68;
  player.y = s.CANVAS_H - PLAYER_H; //g.canvas.height / 2 - player.halfHeight;
  player.isGrounded = true;
  scene.addChild(player);

  createKeypressController(player, 32, 39, 40, 37);

  return player;
}

function createKeypressController(sprite, up, right, down, left) {
  //Create a `direction` property on the sprite
  sprite.direction = "";

  //Create some keyboard objects
  const leftArrow = g.keyboard(left);
  const upKey = g.keyboard(up);
  const rightArrow = g.keyboard(right);
  const downArrow = g.keyboard(down);

  leftArrow.press = function() {
    sprite.vx = -hSpeed;
    sprite.direction = "left";
  };
  leftArrow.release = function() {
    sprite.vx = 0;
  };

  rightArrow.press = function() {
    sprite.vx = hSpeed;
    sprite.direction = "right";
  };
  rightArrow.release = function() {
    sprite.vx = 0;
  };

  upKey.press = function() {
    sprite.vy = -upSpeed;
    sprite.direction = "up";
    sprite.isGrounded = false;
  };
  // upKey.release = function() {
  //   // if (!downArrow.isDown && sprite.vx === 0) {
  //   //   sprite.vy = 0;
  //   // }
  //   // sprite._jumping = false;
  //   // sprite.vy = -upSpeed;
  //   // sprite.direction = "down";
  // };

  downArrow.press = function() {
    sprite.vy = gravity;
    sprite.direction = "down";
  };
  downArrow.release = function() {
    if (!upKey.isDown && sprite.vx === 0) {
      sprite.vy = 0;
    }
  };
}

// in game loop
export function movePlayer(player, stoppedBlocks) {
  g.move(player);

  // at jumping apogee or falling? accelerate & check collision w/ stage & rocks
  if (!player.isGrounded && player.vy >= 0) {
    player.vy += 1;
  }
  // jumping (vy < 0)? gravity slows down
  if (player.vy < 0) {
    player.vy += 1;
  }

  //Keep the player contained inside the stage's area
  const collision = g.contain(player, g.stage.localBounds);
  if (collision === 'bottom') {
    console.log(`player collides - stage bottom`)
    player.isGrounded = true;
    player.vy = 0;
  }

  // player hits side of stopped block?
  stoppedBlocks.forEach((block, inx) => {
    const collision = g.rectangleCollision(player, block, false, true);
    if (collision === 'left' || collision === 'right') {
      console.log(`player collides-x with block - ${collision}`)
      player._previousVx = player.vx; // capture direction - left or right
      if (player.vy === 0) // not also y-moving, too? stop x-movement
        player.vx = 0;
    }
    else if (collision === 'bottom' || collision === 'top') {
      console.log(`player collides-y with block - ${collision}`)
      player.isGrounded = true;
      player._previousVy = player.vy; // capture direction - down or up
      player.vy = 0; // stop moving
    }
  });

  // did just move off solid onto open space? start falling
  if (player.isGrounded) {
    let {col, remainder} = utils.gridCol(player),
      row = utils.gridRowCeil(player);
    if (row < NUM_ROWS - 1 && !remainder && fixedBlocksMap[row+1][col] === 0) {
      console.log(`player falls! r,c ${row},${col} .${remainder}`)
      player.isGrounded = false;
      player.vy = gravity;
    }
  }

}

// in game loop
export function processPlayerHit(player, playerHit, healthBar) {
  if (playerHit) {
    player.alpha = 0.5; // semi-transparent
    // player dies - no health left
    healthBar.inner.width = 0;
  }
  else {
    //Make the player fully opaque (non-transparent) if it hasn't been hit
    player.alpha = 1;
  }

}

