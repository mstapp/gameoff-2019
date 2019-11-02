
let g; // ga instance; dynamically bound to window.g below
let s; // game state; dynamically bound to window.s below

const ensureGlobals = () => {
    g = window.g;
    s = window.s;
}

export function init() {
  ensureGlobals();
}

export function myCurrentSlot(sprite) {
  let slot = Math.round(sprite.x / s.NUM_BLOCK_SLOTS);
  if (slot >= s.NUM_BLOCK_SLOTS)
    --slot;
  return slot;
}
