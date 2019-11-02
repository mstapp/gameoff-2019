
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}


//Make the enemies
let //numberOfEnemies = 3,
  spacing = 48,
  xOffset = 150,
  speed = 3,
  direction = 1;

export function create(numEnemies, scene) {
  ensureGlobals();
  let enemies = [];
  for (let i = 0; i < numEnemies; i++) {

    //Each enemy is a red rectangle
    let enemy = g.rectangle(32, 32, "red");
    //Space each enemey horizontally according to the "spacing" value.
    //"xOffset" determines the point from the left of the screen
    //at which the first enemy should be added.
    let x = spacing * i + xOffset;

    //Give the enemy a random y position
    let y = g.randomInt(0, g.canvas.height - enemy.height + 10);

    //Set the enemy's direction
    enemy.x = x;
    enemy.y = y;

    //Set the enemy's vertical velocity. "direction" will be either "1" or
    //"-1". "1" means the enemy will move down and "-1" means the enemy will
    //move up. Multiplying "direction" by "speed" determines the enemy's
    //vertical direction
    enemy.vy = speed * direction;

    //Reverse the direction for the next enemy
    direction *= -1;

    //Push the enemy into the "enemies" array & add to gameScene
    enemies.push(enemy);
    scene.addChild(enemy);
  }

  return enemies;
}

export function moveAndCheckCollisions(enemies, player) {
  let playerHit = false;

  //Loop through all the sprites in the "enemies" array
  let loopCount = 0;
  enemies.forEach(function(enemy, inx) {
    loopCount++;
    //Move the enemy
    g.move(enemy);

    //Check the enemy's screen boundaries
    let enemyHitsEdges = g.contain(enemy, g.stage.localBounds);

    //If the enemy hits the top or bottom of the stage, reverse
    //its direction
    if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom") {
      enemy.vy *= -1;
    }

    // for field hittest, "true" = use global coords
    if (g.hitTestRectangle(player, enemy)) {
      playerHit = true;
    }
  });

  return {playerHit};
}

// export function create(numEnemies, scene) {
//   ensureGlobals();
//   let enemies = [];
//   for (let i = 0; i < numEnemies; i++) {

//     //Each enemy is a red rectangle w/ "field" (of vision) facing front
//     let enemy = g.rectangle(32, 32, "red"),
//       field = g.rectangle(32*3, 32*3, 'green');//(i === 0) ? "yellow" : 'cyan');
//     field.alpha = 0.3;

//     //Space each enemey horizontally according to the "spacing" value.
//     //"xOffset" determines the point from the left of the screen
//     //at which the first enemy should be added.
//     let x = spacing * i + xOffset;

//     //Give the enemy a random y position
//     let y = g.randomInt(0, g.canvas.height - enemy.height + 10);

//     //Set the enemy's direction
//     enemy.x = x;
//     enemy.y = y;
//     enemy.addChild(field);
//     enemy.field = field; // convenience
//     if (direction === 1) {
//       enemy.putBottom(field, 0,0);// -enemy.width, enemy.height);
//       // field.x = x + 13;
//       // field.y = y - 6;
//     }
//     else {
//       enemy.putTop(field, 0,0);// -enemy.width, enemy.height);
//       // field.x = x + 13;
//       // field.y = y - 6;
//     }

//     //Set the enemy's vertical velocity. "direction" will be either "1" or
//     //"-1". "1" means the enemy will move down and "-1" means the enemy will
//     //move up. Multiplying "direction" by "speed" determines the enemy's
//     //vertical direction
//     enemy.vy = speed * direction;
//     field.vy = enemy.vy;

//     //Reverse the direction for the next enemy
//     direction *= -1;

//     //Push the enemy into the "enemies" array & add to gameScene
//     enemies.push(enemy);
//     scene.addChild(enemy);
//   }

//   return enemies;
// }

// export function moveAndCheckCollisions(enemies, player) {
//   let playerHit = false;

//   //Loop through all the sprites in the "enemies" array
//   let loopCount = 0;
//   enemies.forEach(function(enemy, inx) {
//     loopCount++;
//     const field = enemy.field;
//     //Move the enemy (its child field will follow)
//     g.move(enemy);

//     //Check the enemy's screen boundaries
//     let enemyHitsEdges = g.contain(enemy, g.stage.localBounds),
//       fieldBounds = {x: field.gx, y: field.gy, width: field.width, height: field.height},
//       fieldHitsEdges = g.outsideBounds(fieldBounds, g.stage.localBounds);

//     // if (inx === 0 && loopCount % 100 === 1) {
//     //   console.log("fieldBounds = ", fieldBounds)
//     //   console.log("g.stage.localBounds = ", g.stage.localBounds)
//     //   if (fieldHitsEdges) {
//     //     console.log("fieldHitsEdges = ${fieldHitsEdges}")
//     //   }
//     // }

//     //If the enemy hits the top or bottom of the stage, reverse
//     //its direction
//     if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom"
//         || fieldHitsEdges === "top" || fieldHitsEdges === "bottom") {
//       enemy.vy *= -1;
//       enemy.field.vy *= -1;
//     }

//     // for field hittest, "true" = use global coords
//     if (g.hitTestRectangle(player, enemy) || g.hitTestRectangle(player, enemy.field, true)) {
//       playerHit = true;
//     }
//   });

//   return {playerHit};
// }

