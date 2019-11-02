import * as utils from './utils';

let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}

const PLAYER_H = 32,
  PLAYER_W = 32;

export function create(scene) {
  ensureGlobals();
  let player = g.rectangle(PLAYER_W, PLAYER_H, 'blue');
  player.x = 68;
  player.y = s.CANVAS_H - PLAYER_H; //g.canvas.height / 2 - player.halfHeight;
  scene.addChild(player);

  createKeypressController(player, 5, 32, 39, 40, 37);

  return player;
}

function createKeypressController(sprite, speed, up, right, down, left) {
  //Create a `direction` property on the sprite
  sprite.direction = "";

  //Create some keyboard objects
  var leftArrow = g.keyboard(left);
  var upKey = g.keyboard(up);
  var rightArrow = g.keyboard(right);
  var downArrow = g.keyboard(down);

  //Assign key `press` and release methods
  leftArrow.press = function() {
    sprite.vx = -speed;
    sprite.vy = 0;
    sprite.direction = "left";
  };
  leftArrow.release = function() {
    if (!rightArrow.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  };
  upKey.press = function() {
    if (sprite._jumping)
      return;
    sprite._jumping = true;
    sprite.vy = -speed;
    sprite.vx = 0;
    sprite.direction = "up";
    g.wait(200, () => {
      sprite._jumping = false;
      sprite.vy = 0;
      // new ypos = on top of the top block for this slot
      const mySlot = utils.myCurrentSlot(sprite);
      const blockTop = s.maxSlotYPositions[mySlot];
      sprite.y = blockTop - sprite.height;

      //TODO - get the leap-on-block mechanic done

    });
  };
  upKey.release = function() {
    // if (!downArrow.isDown && sprite.vx === 0) {
    //   sprite.vy = 0;
    // }
  };
  rightArrow.press = function() {
    sprite.vx = speed;
    sprite.vy = 0;
    sprite.direction = "right";
  };
  rightArrow.release = function() {
    if (!leftArrow.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  };
  downArrow.press = function() {
    sprite.vy = speed;
    sprite.vx = 0;
    sprite.direction = "down";
  };
  downArrow.release = function() {
    if (!upKey.isDown && sprite.vx === 0) {
      sprite.vy = 0;
    }
  };
}

// in game loop
export function movePlayer(player, stoppedEnemies) {
  //Move the player
  g.move(player);

  //Keep the player contained inside the stage's area
  g.contain(player, g.stage.localBounds);

  // player hits stopped block?
  stoppedEnemies.forEach((block, inx) => {
    // if (g.hitTestRectangle(player, block)) {
    //   player.vx = 0; // stop moving
    //   // reposition at edge of block
    //   if (player.x < block.x) // left side of block
    //     player.x = block.x - PLAYER_W;
    //   else // right side
    //     player.x = block.x + PLAYER_W;
    // }
    const collision = g.rectangleCollision(player, block);
    if (collision === 'left' || collision === 'right') {
      player._previousVx = player.vx; // capture direction - left or right
      player.vx = 0; // stop moving
    }
  });
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

