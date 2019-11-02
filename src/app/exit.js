let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}

export function create(scene) {
  ensureGlobals();
  //The exit door
  let exit = g.rectangle(48, 48, "green");
  exit.x = 8;
  exit.y = 8;
  scene.addChild(exit);
  return exit;
}

export function checkGameWon(treasure, exit) {
  //If the player has brought the treasure to the exit,
  //end the game and display "You won!"
  if (g.hitTestRectangle(treasure, exit)) {
    g.state = s.end;
    s.message.content = "You won!";
  }
}
