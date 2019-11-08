
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}

export function init() {
  ensureGlobals();
}

// deprecated; use gridCol
export function myCurrentSlot(sprite) {
  return gridCol(sprite);
}

// returns {row, remainder}
export function gridRow(sprite) {
  let row = Math.floor(sprite.y / s.BLOCK_H),
    remainder = sprite.y % s.BLOCK_H;
  if (row >= s.NUM_ROWS)
    --row;
  return {row, remainder};
}

// returns {col, remainder}
export function gridCol(sprite) {
  let col = Math.floor(sprite.x / s.BLOCK_W),
    remainder = sprite.x % s.BLOCK_W;
  if (col >= s.NUM_COLS)
    --col;
  return {col, remainder};
}

// Returns row that sprite is on, +1 if any fractional amount.
export function gridRowCeil(sprite) {
  let row = Math.ceil(sprite.y / s.BLOCK_H);
  if (row >= s.NUM_ROWS)
    --row;
  return row;
}

// returns grid that sprite is on, +1 if any fractional amount
export function gridColCeil(sprite) {
  let col = Math.ceil(sprite.x / s.BLOCK_W);
  if (col >= s.NUM_COLS)
    --col;
  return col;
}

