import Vector from './Vector.js'
import GridItem from './Grid-item.js'

class Grid {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.lastTime = 0
    this.deltaTime = 0
    this.step = 1 / 60
    this.gridItems = []
    this.initGrid()

    const loader = (ms) => {
      if (this.lastTime) {
        // console.log((ms - this.lastTime) / 1000)
        this.simulate((ms - this.lastTime) / 1000)
        this.draw((ms - this.lastTime) / 1000)
      }

      this.lastTime = ms;
      requestAnimationFrame(loader)
    }

    loader()
  }

  draw(dt) {
    this.gridItems.map(gridItem => {
      this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
      this.context.lineWidth = 1;
      this.context.strokeRect(gridItem.position.x, gridItem.position.y, gridItem.size.x, gridItem.size.y);
      this.context.fillStyle = `rgba(${gridItem.color.red},${gridItem.color.blue},${gridItem.color.green},1)`
      this.context.fillRect(gridItem.position.x, gridItem.position.y, gridItem.size.x, gridItem.size.y);
    })
  }

  simulate(dt) {
    this.gridItems.forEach(gridItem => {
      if (gridItem.animating) {
        gridItem.update(dt);
      }
    })
  }

  initGrid() {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        let gridItem = new GridItem(this.canvas.width / 10, this.canvas.width / 10)
        gridItem.position.y = y * (this.canvas.height / 10)
        gridItem.position.x = x * (this.canvas.width / 10)
        this.gridItems.push(gridItem)
      }
    }
  }

  changeGridItemColor(x, y) {
    const item = this.gridItems.find(gridItem => {
      if (x >= gridItem.position.x && x <= gridItem.position.x + gridItem.size.x &&
        y >= gridItem.position.y && y <= gridItem.position.y + gridItem.size.y) {
        return true
      }
      return false
    })
    if (item && item.animating === false) {
      item.color = { red: 0, blue: 0, green: 0 };
      item.animating = true;
    }
  }
}

const canvas = document.getElementById('grid')
const grid = new Grid(canvas)

const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator()
const gain = audioContext.createGain()
oscillator.connect(gain)
oscillator.type = 'square';
gain.connect(audioContext.destination)
oscillator.start(0)

canvas.addEventListener('mouseup', event => {
  gain.gain.exponentialRampToValueAtTime(
    0.00001, audioContext.currentTime + 0.04
  )
  const scaleX = event.offsetX / event.target.getBoundingClientRect().width;
  const scaleY = event.offsetY / event.target.getBoundingClientRect().height;
  grid.changeGridItemColor(scaleX * canvas.width, scaleY * canvas.height)
})

canvas.addEventListener('drag', event => {
  if (event.clientX > 0 || event.clientY > 0) {
    const scaleX = event.offsetX / event.target.getBoundingClientRect().width;
    const scaleY = event.offsetY / event.target.getBoundingClientRect().height;
    grid.changeGridItemColor(scaleX * canvas.width, scaleY * canvas.height)
  }
})
