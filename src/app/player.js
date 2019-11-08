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
  gravity = 5,
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

// function createKeypressController(sprite, up, right, down, left) {
//   //Create a `direction` property on the sprite
//   sprite.direction = "";

//   //Create some keyboard objects
//   var leftArrow = g.keyboard(left);
//   var upKey = g.keyboard(up);
//   var rightArrow = g.keyboard(right);
//   var downArrow = g.keyboard(down);

//   //Assign key `press` and release methods
//   leftArrow.press = function() {
//     sprite.vx = -hSpeed;
//     // sprite.vy = 0;
//     sprite.direction = "left";
//   };
//   leftArrow.release = function() {
//     // if (!rightArrow.isDown && sprite.vy === 0) {
//     if (!rightArrow.isDown) {
//       sprite.vx = 0;
//     }
//   };
//   rightArrow.press = function() {
//     sprite.vx = hSpeed;
//     // sprite.vy = 0;
//     sprite.direction = "right";
//   };
//   rightArrow.release = function() {
//     // if (!leftArrow.isDown && sprite.vy === 0) {
//     if (!leftArrow.isDown) {
//       sprite.vx = 0;
//     }
//   };
//   upKey.press = function() {
//     // if (sprite._jumping)
//     //   return;
//     // sprite._jumping = true;
//     sprite.vy = -upSpeed;
//     // sprite.vx = 0;
//     sprite.direction = "up";
//     sprite._jumping = true;
//     // g.wait(200, () => {
//     //   sprite._jumping = false;
//     //   sprite.vy = 0;
//     //   // new ypos = on top of the top block for this slot
//     //   const mySlot = utils.myCurrentSlot(sprite);
//     //   const blockTop = s.maxSlotYPositions[mySlot];
//     //   sprite.y = blockTop - sprite.height;

//     //   //TODO - get the leap-on-block mechanic done

//     // });
//   };
//   upKey.release = function() {
//     // if (!downArrow.isDown && sprite.vx === 0) {
//     //   sprite.vy = 0;
//     // }
//     // sprite._jumping = false;
//     // sprite.vy = -upSpeed;
//     // sprite.direction = "down";
//   };
//   downArrow.press = function() {
//     sprite.vy = gravity;
//     // sprite.vx = 0;
//     sprite.direction = "down";
//   };
//   downArrow.release = function() {
//     if (!upKey.isDown && sprite.vx === 0) {
//       sprite.vy = 0;
//     }
//   };
// }

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
    // sprite.vy = 0;
    sprite.direction = "left";
  };
  leftArrow.release = function() {
    // if (!rightArrow.isDown && sprite.vy === 0) {
    // if (!rightArrow.isDown) {
    //   sprite.vx = 0;
    // }
    sprite.vx = 0;
  };

  rightArrow.press = function() {
    sprite.vx = hSpeed;
    // sprite.vy = 0;
    sprite.direction = "right";
  };
  rightArrow.release = function() {
    // if (!leftArrow.isDown && sprite.vy === 0) {
    // if (!leftArrow.isDown) {
    //   sprite.vx = 0;
    // }
    sprite.vx = 0;
  };

  upKey.press = function() {
    // if (sprite._jumping)
    //   return;
    // sprite._jumping = true;
    sprite.vy = -upSpeed;
    // sprite.vx = 0;
    sprite.direction = "up";
    sprite.isGrounded = false;
    // g.wait(200, () => {
    //   sprite._jumping = false;
    //   sprite.vy = 0;
    //   // new ypos = on top of the top block for this slot
    //   const mySlot = utils.myCurrentSlot(sprite);
    //   const blockTop = s.maxSlotYPositions[mySlot];
    //   sprite.y = blockTop - sprite.height;

    //   //TODO - get the leap-on-block mechanic done

    // });
  };
  upKey.release = function() {
    // if (!downArrow.isDown && sprite.vx === 0) {
    //   sprite.vy = 0;
    // }
    // sprite._jumping = false;
    // sprite.vy = -upSpeed;
    // sprite.direction = "down";
  };

  downArrow.press = function() {
    sprite.vy = gravity;
    // sprite.vx = 0;
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
  //Move the player
  g.move(player);

  // at jumping apogee or falling? accelerate & check collision w/ stage & rocks
  if (!player.isGrounded && player.vy >= 0) {
    player.vy += 1;
    // // new ypos = on top of the top block for this slot
    // const mySlot = utils.myCurrentSlot(sprite);
    // const blockTop = s.maxSlotYPositions[mySlot];
    // sprite.y = blockTop - sprite.height;
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
    // if (g.hitTestRectangle(player, block)) {
    //   player.vx = 0; // stop moving
    //   // reposition at edge of block
    //   if (player.x < block.x) // left side of block
    //     player.x = block.x - PLAYER_W;
    //   else // right side
    //     player.x = block.x + PLAYER_W;
    // }
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
  // let {col, remainder} = utils.gridCol(player),
  //   {row} = utils.gridRow(player);
  // console.log(`player grid ${row},${col} .${remainder}`)
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
  //If the player is hit...
  if (playerHit) {
    //Make the player semi-transparent
    player.alpha = 0.5;
    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.inner.width -= 1;
  }
  else {
    //Make the player fully opaque (non-transparent) if it hasn't been hit
    player.alpha = 1;
  }

}

