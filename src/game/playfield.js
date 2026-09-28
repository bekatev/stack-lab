import { LOCK_MS } from './motion'

export const playfield = {
  ready: false,
  paused: false,
  locked: false,
  reset: false,
  arm: -0.82,
  coins: [{ offset: 0.7 }],
  flash: null,
}

let lockGen = 0

export function takeGrab() {
  if (!playfield.ready || playfield.locked || playfield.paused) return null
  if (!playfield.coins.length) return null
  return {
    arm: playfield.arm,
    coins: playfield.coins.map((coin) => ({ offset: coin.offset })),
  }
}

export function holdCatch(flash) {
  playfield.locked = true
  playfield.flash = flash
  const gen = ++lockGen
  window.setTimeout(() => {
    if (lockGen !== gen) return
    playfield.locked = false
    playfield.flash = null
  }, LOCK_MS)
}

export function resetPlayfield() {
  lockGen += 1
  playfield.locked = false
  playfield.flash = null
  playfield.reset = true
}
