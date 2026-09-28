import { createSlice } from '@reduxjs/toolkit'
import { BETS, STARTING_CREDITS } from '../game/motion'

function freshSession(bet = BETS[1]) {
  return {
    credits: STARTING_CREDITS,
    bet,
    streak: 0,
    bestStreak: 0,
    history: [STARTING_CREDITS],
    last: null,
    status: 'play',
  }
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: freshSession(),
  reducers: {
    setBet(state, action) {
      state.bet = action.payload
    },
    applyGrab(state, action) {
      const { kind, delta, gap } = action.payload
      state.credits = Math.max(0, state.credits + delta)
      state.last = { kind, delta, gap }
      if (kind === 'perfect' || kind === 'good') {
        state.streak += 1
        state.bestStreak = Math.max(state.bestStreak, state.streak)
      } else if (kind === 'miss') {
        state.streak = 0
      }
      state.history.push(state.credits)
      if (state.history.length > 24) state.history.shift()
      state.status = state.credits < BETS[0] ? 'broke' : 'play'
    },
    restart(state) {
      return freshSession(state.bet)
    },
  },
})

export const { setBet, applyGrab, restart } = sessionSlice.actions
export default sessionSlice.reducer
