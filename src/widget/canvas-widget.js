const canvas = document.querySelector('#widget')
const ctx = canvas.getContext('2d')

let x = 40
let direction = 1

function frame() {
  x += direction * 3
  if (x > canvas.width - 40 || x < 40) direction *= -1

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f4f1ea'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#141414'
  ctx.beginPath()
  ctx.arc(x, canvas.height / 2, 18, 0, Math.PI * 2)
  ctx.fill()

  requestAnimationFrame(frame)
}

frame()
