import Game from '../models/game'
const { Store } = require('westore')

const game = new Game
const { snake, map } = game

game.start()

class GameStore extends Store {
  constructor() {
    super()
    this.data = {
      map,
      paused: false,
      highSpeed: false
    }
  }

  turnUp() {
    snake.turnUp()
  }

  turnRight() {
    snake.turnRight()
  }

  turnDown() {
    snake.turnDown()
  }

  turnLeft() {
    snake.turnLeft()
  }

  pauseOrPlay = () => {
    if (game.paused) {
      game.play()
      this.data.paused = false
    } else {
      game.pause()
      this.data.paused = true
    }
  }

  reset() {
    game.reset()
  }

  toggleSpeed() {
    game.toggleSpeed()
    this.data.highSpeed = !this.data.highSpeed
  }
}

module.exports = new GameStore
