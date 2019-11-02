let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}


export function create(scene) {
  ensureGlobals();
  //Create the health bar
  let outerBar = g.rectangle(128, 16, "black"),
      innerBar = g.rectangle(128, 16, "yellowGreen");

  //Group the inner and outer bars
  let healthBar = g.group(outerBar, innerBar);

  //Set the `innerBar` as a property of the `healthBar`
  healthBar.inner = innerBar;

  //Position the health bar
  healthBar.x = g.canvas.width - 148;
  healthBar.y = 16;

  //Add the health bar to the `gameScene`
  scene.addChild(healthBar);
  return healthBar;
}

export function checkGameLost(healthBar) {
  //Does the player have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.inner.width < 0) {
    g.state = s.end;
    s.message.content = "You lost!";
  }
}

