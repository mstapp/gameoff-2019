let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}


export function create(scene) {
  ensureGlobals();
  //Create the health bar
  let outerBar = g.rectangle(128, 32, "#efefef");
      // innerBar = g.rectangle(128, 16, "yellowGreen");

  //Group the inner and outer bars
  let healthBar = g.group(outerBar);

  //Set the `innerBar` as a property of the `healthBar`
  // healthBar.inner = innerBar;
  healthBar.alive = true;

  healthBar.score = 0;

  let scoreText = g.text(String(healthBar.score), "16px Futura", "black", 70, 10);
  // scoreText.x = 120;
  // scoreText.y = g.canvas.height / 2 - 64;
  healthBar.scoreText = scoreText;
  healthBar.addChild(scoreText);

  //Position the health bar
  healthBar.x = g.canvas.width - 128;
  healthBar.y = 0;

  //Add the health bar to the `gameScene`
  scene.addChild(healthBar);

  healthBar.addScore = addScore;
  return healthBar;
}

export function checkGameLost(healthBar) {
  //Does the player have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (!healthBar.alive) {
    g.state = s.end;
    s.message.content = "You lost!";
  }
}

export function addScore(delta) {
  s.healthBar.score += delta;
  s.healthBar.scoreText.content = String(s.healthBar.score);
}

