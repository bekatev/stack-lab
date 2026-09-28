import { useEffect, useRef } from 'react'

export function HistoryCanvas({ values }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f4f1ea'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#c8c2b4'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(12, height / 2)
    ctx.lineTo(width - 12, height / 2)
    ctx.stroke()

    if (values.length === 0) return

    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const point = (value, index) => {
      const x = 12 + (index / Math.max(values.length - 1, 1)) * (width - 24)
      const y = height - 16 - ((value - min) / span) * (height - 32)
      return [x, y]
    }

    ctx.strokeStyle = '#141414'
    ctx.lineWidth = 2
    ctx.beginPath()
    values.forEach((value, index) => {
      const [x, y] = point(value, index)
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    const [lastX, lastY] = point(values[values.length - 1], values.length - 1)
    ctx.fillStyle = '#141414'
    ctx.beginPath()
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
    ctx.fill()
  }, [values])

  return <canvas ref={canvasRef} className="history-canvas" width={640} height={140} />
}
