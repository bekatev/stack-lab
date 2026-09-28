import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyGrab, restart, setBet } from './store/sessionSlice'
import { useLab } from './context/LabContext'
import { usePixiStage } from './hooks/usePixiStage'
import { HistoryCanvas } from './canvas/HistoryCanvas'
import { ActionButton } from './components/ActionButton'
import { CreditReadout } from './components/CreditReadout'
import { BETS, judge } from './game/motion'
import { holdCatch, resetPlayfield, takeGrab } from './game/playfield'

function formatMoney(amount) {
  return Math.abs(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function describe(last) {
  if (!last) return 'They start apart and walk toward each other.'
  const gap = `${Math.round(last.gap)}°`
  if (last.kind === 'perfect') return `Perfect · ${gap}. +${formatMoney(last.delta)}`
  if (last.kind === 'good') return `Caught · ${gap}. +${formatMoney(last.delta)}`
  if (last.kind === 'graze') return `Graze · ${gap}. Bet stays.`
  return `Miss · ${gap}. −${formatMoney(last.delta)}`
}

export function Lab() {
  const dispatch = useDispatch()
  const { credits, bet, streak, bestStreak, history, last, status } = useSelector((state) => state.session)
  const { spinePlaying, showGuide, toggleSpine, toggleGuide } = useLab()
  const stageRef = useRef(null)
  const [stageState, setStageState] = useState('loading')
  const broke = status === 'broke'
  const canAfford = credits >= bet

  const act = useCallback(() => {
    if (broke) {
      resetPlayfield()
      dispatch(restart())
      return
    }
    const snap = takeGrab()
    if (!snap) return
    const result = judge(snap.arm, snap.coins, bet)
    holdCatch({ index: result.index, kind: result.kind })
    dispatch(applyGrab(result))
  }, [bet, broke, dispatch])

  usePixiStage(stageRef, {
    running: spinePlaying,
    showGuide,
    streak,
    onGrab: act,
    onStatus: setStageState,
  })

  useEffect(() => {
    const onKey = (event) => {
      if (event.repeat) return
      if (event.code !== 'Space' && event.code !== 'Enter') return
      event.preventDefault()
      act()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [act])

  const ready = stageState === 'ready'
  const buttonLabel = !ready ? (stageState === 'error' ? 'Arm missing' : 'Loading') : broke ? 'New game' : 'Grab'
  const buttonDisabled = !ready || stageState === 'error' || (!broke && (!spinePlaying || !canAfford))

  return (
    <div className="lab">
      <header className="lab-header">
        <p className="eyebrow">Reach</p>
        <h1>Catch the coin</h1>
        <p className="subhead">Grab when a coin sits in the hand. Space does it too.</p>
      </header>

      <div className="lab-grid">
        <section className="panel">
          <div className="panel-label">
            <span>Table</span>
            <span>{broke ? 'Out of credits' : spinePlaying ? 'Live' : 'Paused'}</span>
          </div>
          <div className="stage" ref={stageRef} />
          <p className="hint">
            The hand sweeps an arc. Coins ride that same arc. Click the table or press Grab.
            A streak speeds the coins up. At 3 and at 6, another coin joins.
          </p>
        </section>

        <section className="panel">
          <div className="panel-label">
            <span>Stake</span>
            <span>credits at risk</span>
          </div>
          <CreditReadout credits={credits} bet={bet} streak={streak} />
          <div className="bet-row">
            {BETS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === bet ? 'chip is-selected' : 'chip'}
                onClick={() => dispatch(setBet(value))}
              >
                ${value}
              </button>
            ))}
          </div>
          <ActionButton onClick={act} disabled={buttonDisabled}>
            {buttonLabel}
          </ActionButton>
          <p className={`result ${last ? last.kind : ''}`} aria-live="polite">{describe(last)}</p>
          <p className="best">Best streak {bestStreak}</p>
          {!broke && !canAfford && <p className="hint">Your credits can't cover this bet.</p>}

          <div className="panel-label context-label">
            <span>Table options</span>
          </div>
          <div className="toggle-row">
            <button type="button" className="text-button" onClick={toggleSpine}>
              Motion {spinePlaying ? 'running' : 'paused'}
            </button>
            <button type="button" className="text-button" onClick={toggleGuide}>
              Windows {showGuide ? 'on' : 'off'}
            </button>
          </div>
          <ul className="rules">
            <li>Perfect, within 9°: add 3× the bet</li>
            <li>Caught, within 18°: add the bet</li>
            <li>Graze, within 30°: the bet stays, and so does the streak</li>
            <li>Miss: the bet is lost and the streak ends</li>
          </ul>
        </section>
      </div>

      <section className="panel">
        <div className="panel-label">
          <span>Bankroll</span>
          <span>after each grab</span>
        </div>
        <HistoryCanvas values={history} />
      </section>
    </div>
  )
}
