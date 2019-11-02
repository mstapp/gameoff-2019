
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}


export function create(scene) {
  ensureGlobals();
  //Create the treasure
  let treasure = g.rectangle(16, 16, "gold");

  //Position it next to the left edge of the canvas
  treasure.x = g.canvas.width - treasure.width - 10;
  treasure.y = g.canvas.height / 2 - treasure.halfHeight;

  //Create a `pickedUp` property on the treasure to help us Figure
  //out whether or not the treasure has been picked up by the player
  treasure.pickedUp = false;
  scene.addChild(treasure);
  return treasure;
}

export function onPlayLoop(treasure, player, chimes) {
  //Check for a collision between the player and the treasure
  if (g.hitTestRectangle(player, treasure)) {

    //If the treasure is touching the player, center it over the player
    treasure.x = player.x + 8;
    treasure.y = player.y + 8;

    if (!treasure.pickedUp) {
      //If the treasure hasn't already been picked up,
      //play the `chimes` sound
      chimes.play();
      treasure.pickedUp = true;
    };
  }
}

