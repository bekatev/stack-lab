import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { Physics } from '@esotericsoftware/spine-core'
import { Spine } from '@esotericsoftware/spine-pixi-v7'
import { AMP, ARM_SPEED, WINDOWS, coinCount, coinSpeed, spawnCoin, stepBounce } from '../game/motion'
import { playfield } from '../game/playfield'

const spineBase = `${import.meta.env.BASE_URL}spine/`

if (!PIXI.Assets.resolver.hasKey('mascotData')) {
  PIXI.Assets.add({ alias: 'mascotData', src: `${spineBase}mascot.json` })
  PIXI.Assets.add({ alias: 'mascotAtlas', src: `${spineBase}mascot.atlas` })
}

const STAGE_W = 640
const STAGE_H = 360
const SHOULDER = { x: 320, y: 336 }
const SCALE = 2.4

function freshSim() {
  return {
    arm: { offset: -0.82, dir: 1 },
    coins: [{ offset: 0.7, dir: -1 }],
  }
}

function pointAt(samples, offset) {
  const clamped = Math.max(-1, Math.min(1, offset))
  const f = ((clamped + 1) / 2) * (samples.length - 1)
  const i0 = Math.floor(f)
  const i1 = Math.min(samples.length - 1, i0 + 1)
  const mix = f - i0
  const a = samples[i0]
  const b = samples[i1]
  return {
    x: a.x + (b.x - a.x) * mix,
    y: a.y + (b.y - a.y) * mix,
  }
}

function chord(samples, degrees) {
  const origin = pointAt(samples, 0)
  const edge = pointAt(samples, degrees / AMP)
  return Math.hypot(edge.x - origin.x, edge.y - origin.y)
}

export function usePixiStage(containerRef, { running, showGuide, streak, onGrab, onStatus }) {
  const grabRef = useRef(onGrab)
  const statusRef = useRef(onStatus)
  const runningRef = useRef(running)
  const guideRef = useRef(showGuide)
  const streakRef = useRef(streak)
  grabRef.current = onGrab
  statusRef.current = onStatus
  runningRef.current = running
  guideRef.current = showGuide
  streakRef.current = streak
  playfield.paused = !running

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let cancelled = false
    const app = new PIXI.Application({
      width: STAGE_W,
      height: STAGE_H,
      backgroundColor: 0x141414,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    })
    app.view.style.width = '100%'
    app.view.style.height = 'auto'
    app.view.style.display = 'block'
    app.view.tabIndex = -1
    container.appendChild(app.view)

    const onPointer = () => grabRef.current()
    app.view.addEventListener('pointerdown', onPointer)

    const track = new PIXI.Graphics()
    const armGfx = new PIXI.Graphics()
    const rings = new PIXI.Graphics()
    const coins = [0, 1, 2].map(() => new PIXI.Graphics())
    app.stage.addChild(track)
    app.stage.addChild(armGfx)
    coins.forEach((coin) => app.stage.addChild(coin))
    app.stage.addChild(rings)

    let sim = freshSim()
    let samples = []
    let radii = { perfect: 18, good: 36, graze: 52 }
    let armBone = null
    let handBone = null
    let actor = null

    const poseArm = () => {
      if (!armBone || !handBone || !actor) return
      armBone.pose.rotation = 90 + playfield.arm * AMP
      handBone.pose.rotation = playfield.locked ? 24 : -6
      actor.update(0)
    }

    const drawCoin = (graphic, point, kind) => {
      const fill = kind === 'perfect' || kind === 'good'
        ? 0xf2c14e
        : kind === 'miss'
          ? 0xd35a4a
          : kind === 'graze'
            ? 0xb7b1a6
            : 0xffffff
      graphic.clear()
      graphic.beginFill(fill)
      graphic.drawCircle(0, 0, 16)
      graphic.endFill()
      graphic.beginFill(0x141414)
      graphic.drawCircle(0, 0, 6)
      graphic.endFill()
      graphic.position.set(point.x, point.y)
      graphic.visible = true
    }

    const draw = () => {
      if (!samples.length) return
      poseArm()
      const hand = pointAt(samples, playfield.arm)
      coins.forEach((graphic, index) => {
        const coin = playfield.coins[index]
        if (!coin) {
          graphic.visible = false
          return
        }
        const flash = playfield.flash
        const kind = flash && flash.index === index ? flash.kind : null
        drawCoin(graphic, pointAt(samples, coin.offset), kind)
      })

      armGfx.clear()
      armGfx.lineStyle({ width: 28, color: 0xffffff, cap: PIXI.LINE_CAP.ROUND })
      armGfx.moveTo(SHOULDER.x, SHOULDER.y)
      armGfx.lineTo(hand.x, hand.y)
      armGfx.lineStyle(0)
      armGfx.beginFill(0xffffff)
      armGfx.drawCircle(hand.x, hand.y, 18 * SCALE)
      armGfx.endFill()

      rings.clear()
      rings.beginFill(0x141414)
      rings.drawCircle(hand.x, hand.y, 5)
      rings.endFill()
      if (guideRef.current) {
        rings.lineStyle(1.5, 0xf2c14e, 0.95)
        rings.drawCircle(hand.x, hand.y, radii.perfect)
        rings.lineStyle(1, 0xffffff, 0.7)
        rings.drawCircle(hand.x, hand.y, radii.good)
        rings.lineStyle(1, 0xffffff, 0.35)
        rings.drawCircle(hand.x, hand.y, radii.graze)
      }
    }

    app.ticker.add(() => {
      if (playfield.reset) {
        sim = freshSim()
        playfield.reset = false
      }

      const dt = Math.min(app.ticker.deltaMS / 1000, 0.05)
      if (!playfield.locked && runningRef.current) {
        const want = coinCount(streakRef.current)
        const speed = coinSpeed(streakRef.current)
        while (sim.coins.length < want) sim.coins.push(spawnCoin(sim.arm.offset))
        if (sim.coins.length > want) sim.coins.length = want
        stepBounce(sim.arm, ARM_SPEED, dt)
        sim.coins.forEach((coin) => stepBounce(coin, speed, dt))
      }

      playfield.arm = sim.arm.offset
      playfield.coins = sim.coins.map((coin) => ({ offset: coin.offset }))
      draw()
    })

    PIXI.Assets.load(['mascotData', 'mascotAtlas'])
      .then(() => {
        if (cancelled) return
        actor = Spine.from({ skeleton: 'mascotData', atlas: 'mascotAtlas', autoUpdate: false })
        actor.position.set(SHOULDER.x, SHOULDER.y)
        actor.scale.set(SCALE)
        actor.visible = false
        app.stage.addChild(actor)
        const loadedArm = actor.skeleton.findBone('arm')
        const loadedHand = actor.skeleton.findBone('hand')

        const built = []
        for (let i = 0; i <= 80; i += 1) {
          const offset = -1 + (i / 80) * 2
          loadedArm.pose.rotation = 90 + offset * AMP
          loadedHand.pose.rotation = -6
          actor.update(0)
          const p = { x: 0, y: 0 }
          actor.getBonePosition('hand', p)
          built.push({
            x: actor.x + p.x * actor.scale.x,
            y: actor.y + p.y * actor.scale.y,
          })
        }
        samples = built
        armBone = loadedArm
        handBone = loadedHand

        radii = {
          perfect: chord(samples, WINDOWS.perfect),
          good: chord(samples, WINDOWS.good),
          graze: chord(samples, WINDOWS.graze),
        }

        track.clear()
        track.lineStyle(2, 0xffffff, 0.28)
        samples.forEach((point, index) => {
          if (index === 0) track.moveTo(point.x, point.y)
          else track.lineTo(point.x, point.y)
        })

        playfield.ready = true
        statusRef.current('ready')
        draw()
      })
      .catch((error) => {
        console.error('Spine failed to load', error)
        if (!cancelled) statusRef.current('error')
      })

    return () => {
      cancelled = true
      playfield.ready = false
      statusRef.current('loading')
      app.view.removeEventListener('pointerdown', onPointer)
      app.destroy(true, { children: true })
    }
  }, [containerRef])
}
