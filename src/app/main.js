import ga from '../libs/ga';
import plugins from '../libs/plugins';
import * as _enemies from './enemies';


const CANVAS_H = 512,
  CANVAS_W = 512*2;

//Create a new Ga instance, and start it.
//Pre-load images in the array.
let g = ga(
  CANVAS_W, CANVAS_H, setup,
  [
    "sounds/chimes.wav"
  ]
);

// game state
let s = {};

window.g = g;
window.s = s;

//Start the Ga engine
g.start();

//Declare your global variables (global to this game)
let player, treasure, enemies, chimes, exit,
    healthBar, message, gameScene, gameOverScene;

//The `setup` function will run only once.
//Use it for initialization tasks
function setup() {
  //Set the canvas border and background color
  g.canvas.style.border = "1px black dashed";
  g.backgroundColor = "white";

  //Create the `chimes` sound object
  chimes = g.sound("sounds/chimes.wav");

  //Create the `gameScene` group
  gameScene = g.group();
  //The exit door
  exit = g.rectangle(48, 48, "green");
  exit.x = 8;
  exit.y = 8;
  gameScene.addChild(exit);

  //The player sprite
  player = g.rectangle(32, 32, "blue");
  player.x = 68;
  player.y = g.canvas.height / 2 - player.halfHeight;
  gameScene.addChild(player);

  //Create the treasure
  treasure = g.rectangle(16, 16, "gold");

  //Position it next to the left edge of the canvas
  treasure.x = g.canvas.width - treasure.width - 10;
  treasure.y = g.canvas.height / 2 - treasure.halfHeight;

  //Create a `pickedUp` property on the treasure to help us Figure
  //out whether or not the treasure has been picked up by the player
  treasure.pickedUp = false;

  //Add the treasure to the `gameScene`
  gameScene.addChild(treasure);

  // //Make the enemies
  // let numberOfEnemies = 3,
  //     spacing = 48,
  //     xOffset = 150,
  //     speed = 1,
  //     direction = 1;

  // enemies = [];
  // for (let i = 0; i < numberOfEnemies; i++) {

  //   //Each enemy is a red rectangle
  //   let enemy = g.rectangle(32, 32, "red");

  //   //Space each enemey horizontally according to the `spacing` value.
  //   //`xOffset` determines the point from the left of the screen
  //   //at which the first enemy should be added.
  //   let x = spacing * i + xOffset;

  //   //Give the enemy a random y position
  //   let y = g.randomInt(0, g.canvas.height - enemy.height);

  //   //Set the enemy's direction
  //   enemy.x = x;
  //   enemy.y = y;

  //   //Set the enemy's vertical velocity. `direction` will be either `1` or
  //   //`-1`. `1` means the enemy will move down and `-1` means the enemy will
  //   //move up. Multiplying `direction` by `speed` determines the enemy's
  //   //vertical direction
  //   enemy.vy = speed * direction;

  //   //Reverse the direction for the next enemy
  //   direction *= -1;

  //   //Push the enemy into the `enemies` array & add to gameScene
  //   enemies.push(enemy);
  //   gameScene.addChild(enemy);
  // }

  enemies = _enemies.createEnemies(3, gameScene);


  //Create the health bar
  let outerBar = g.rectangle(128, 16, "black"),
      innerBar = g.rectangle(128, 16, "yellowGreen");

  //Group the inner and outer bars
  healthBar = g.group(outerBar, innerBar);

  //Set the `innerBar` as a property of the `healthBar`
  healthBar.inner = innerBar;

  //Position the health bar
  healthBar.x = g.canvas.width - 148;
  healthBar.y = 16;

  //Add the health bar to the `gameScene`
  gameScene.addChild(healthBar);

  //Add some text for the game over message
  message = g.text("Game Over!", "64px Futura", "black", 20, 20);
  message.x = 120;
  message.y = g.canvas.height / 2 - 64;

  //Create a `gameOverScene` group and add the message sprite to it
  gameOverScene = g.group(message);

  //Make the `gameOverScene` invisible for now
  gameOverScene.visible = false;

  //Assign the player's keyboard controllers
  g.fourKeyController(player, 5, 38, 39, 40, 37);

  //set the game state to `play`
  g.state = play;
}

//The `play` state
function play() {

  //Move the player
  g.move(player);

  //Keep the player contained inside the stage's area
  g.contain(player, g.stage.localBounds);

  //Move the enemies and check for a collision

  //Set `playerHit` to `false` before checking for a collision
  let playerHit = false;

  //Loop through all the sprites in the `enemies` array
  let loopCount = 0;
  enemies.forEach(function(enemy, inx) {
    loopCount++;
    const field = enemy.field;
    //Move the enemy (its child field will follow)
    g.move(enemy);

    //Check the enemy's screen boundaries
    let enemyHitsEdges = g.contain(enemy, g.stage.localBounds),
      fieldBounds = {x: field.gx, y: field.gy, width: field.width, height: field.height},
      fieldHitsEdges = g.outsideBounds(fieldBounds, g.stage.localBounds);

    // if (inx === 0 && loopCount % 100 === 1) {
    //   console.log(`fieldBounds = `, fieldBounds)
    //   console.log(`g.stage.localBounds = `, g.stage.localBounds)
    //   if (fieldHitsEdges) {
    //     console.log(`fieldHitsEdges = ${fieldHitsEdges}`)
    //   }
    // }

    //If the enemy hits the top or bottom of the stage, reverse
    //its direction
    if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom"
        || fieldHitsEdges === "top" || fieldHitsEdges === "bottom") {
      enemy.vy *= -1;
      enemy.field.vy *= -1;
    }

    // for field hittest, "true" = use global coords
    if (g.hitTestRectangle(player, enemy) || g.hitTestRectangle(player, enemy.field, true)) {
      playerHit = true;
    }
  });

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

  //Check for the end of the game

  //Does the player have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.inner.width < 0) {
    g.state = end;
    message.content = "You lost!";
  }

  //If the player has brought the treasure to the exit,
  //end the game and display "You won!"
  if (g.hitTestRectangle(treasure, exit)) {
    g.state = end;
    message.content = "You won!";
  }
}

function end() {
  //Hide the `gameScene` and display the `gameOverScene`
  gameScene.visible = false;
  gameOverScene.visible = true;
  g.pause();
}
