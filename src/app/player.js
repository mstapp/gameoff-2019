
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}


export function create(scene) {
  ensureGlobals();
  let player = g.rectangle(32, 32, "blue");
  player.x = 68;
  player.y = g.canvas.height / 2 - player.halfHeight;
  scene.addChild(player);
  return player;
}

// in game loop
export function movePlayer(player) {
  //Move the player
  g.move(player);

  //Keep the player contained inside the stage's area
  g.contain(player, g.stage.localBounds);
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

