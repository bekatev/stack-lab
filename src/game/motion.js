export const ARM_SPEED = 0.62
export const AMP = 48
export const WINDOWS = { perfect: 9, good: 18, graze: 30 }
export const BETS = [5, 10, 25]
export const STARTING_CREDITS = 1000
export const LOCK_MS = 740

export function coinSpeed(streak) {
  return Math.min(2.35, 0.9 + streak * 0.12)
}

export function coinCount(streak) {
  if (streak >= 6) return 3
  if (streak >= 3) return 2
  return 1
}

export function gapDegrees(arm, coin) {
  return Math.abs(arm - coin) * AMP
}

export function kindForGap(gap) {
  if (gap <= WINDOWS.perfect) return 'perfect'
  if (gap <= WINDOWS.good) return 'good'
  if (gap <= WINDOWS.graze) return 'graze'
  return 'miss'
}

export function deltaFor(kind, bet) {
  if (kind === 'perfect') return bet * 3
  if (kind === 'good') return bet
  return kind === 'graze' ? 0 : -bet
}

export function judge(arm, coins, bet) {
  let bestIndex = 0
  let bestGap = Infinity
  coins.forEach((coin, index) => {
    const gap = gapDegrees(arm, coin.offset)
    if (gap < bestGap) {
      bestGap = gap
      bestIndex = index
    }
  })
  const kind = kindForGap(bestGap)
  return { index: bestIndex, kind, gap: bestGap, delta: deltaFor(kind, bet) }
}

export function stepBounce(body, speed, dt) {
  let offset = body.offset + body.dir * speed * dt
  let dir = body.dir
  let guard = 0
  while ((offset > 1 || offset < -1) && guard < 8) {
    if (offset > 1) {
      offset = 2 - offset
      dir = -1
    } else {
      offset = -2 - offset
      dir = 1
    }
    guard += 1
  }
  body.offset = Math.max(-1, Math.min(1, offset))
  body.dir = dir
}

export function spawnCoin(armOffset) {
  return {
    offset: armOffset > 0 ? -0.92 : 0.92,
    dir: armOffset > 0 ? 1 : -1,
  }
}
